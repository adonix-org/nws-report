/*
 * Copyright (C) 2025 Ty Busby
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    NWSResponseError,
    NWSFetchError,
    NWSJsonError,
    isNWSProblemDetails,
    HTTPError,
} from "./error";

export abstract class NationalWeatherService<T> {
    private static _origin = "https://api.weather.gov";

    public static readonly headers: Headers = new Headers({
        Accept: "application/geo+json",
    });
    protected readonly headers = new Headers();

    protected readonly params = new URLSearchParams();

    public static get origin() {
        return this._origin;
    }

    public static set origin(origin: string) {
        this._origin = origin;
    }

    public async get(): Promise<T> {
        const url = new URL(`${NationalWeatherService.origin}${this.resource}`);

        for (const [key, value] of this.params) {
            url.searchParams.set(key, value);
        }

        // Merge static and instance headers.
        const headers = new Headers(NationalWeatherService.headers);
        new Headers(this.headers).forEach((v, k) => headers.set(k, v));

        let response: Response;
        try {
            response = await fetch(url, {
                method: "GET",
                headers: headers,
            });
        } catch (cause) {
            throw new NWSFetchError(url, cause);
        }

        const text = await response.text();
        if (response.ok) {
            try {
                return JSON.parse(text) as T;
            } catch (cause) {
                throw new NWSJsonError(url, response.status, text, cause);
            }
        }

        // --- Everything below is an error, response not ok. ---
        if (text.trim() === "") {
            throw new HTTPError(url, response.status, "(empty response text)");
        }

        const contentType =
            response.headers.get("Content-Type")?.toLowerCase() ?? "";
        const isJsonContent =
            contentType.includes("application/json") ||
            contentType.includes("+json");
        if (!isJsonContent) {
            throw new HTTPError(url, response.status, text, text);
        }

        let json: unknown;
        try {
            json = JSON.parse(text);
        } catch (cause) {
            // Returned text was not JSON despite content type.
            throw new HTTPError(url, response.status, text, cause);
        }

        if (isNWSProblemDetails(json)) {
            // content-type = `application/problem+json`
            throw new NWSResponseError(url, response.status, json);
        }

        // Error received was JSON, but not as NWSProblemDetails.
        throw new NWSJsonError(url, response.status, json);
    }

    protected abstract get resource(): string;
}
