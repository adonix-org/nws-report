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
    NWSParseError,
    NWSProblemDetails,
} from "./error";

export abstract class NationalWeatherService<T> {
    private static _origin = "https://api.weather.gov";
    private static _userAgent?: string;

    protected readonly params = new URLSearchParams();

    protected readonly headers = new Headers({
        Accept: "application/geo+json",
    });

    public static get origin(): string {
        return this._origin;
    }

    public static set origin(origin: string) {
        this._origin = origin;
    }

    public static get userAgent(): string | undefined {
        return this._userAgent;
    }

    public static set userAgent(userAgent: string) {
        this._userAgent = userAgent;
    }

    public async get(): Promise<T> {
        const url = new URL(`${NationalWeatherService.origin}${this.resource}`);

        if (NationalWeatherService.userAgent) {
            this.headers.set("User-Agent", NationalWeatherService.userAgent);
        }

        for (const [key, value] of this.params) {
            url.searchParams.set(key, value);
        }

        let response: Response;
        try {
            response = await fetch(url, {
                method: "GET",
                headers: this.headers,
            });
        } catch (cause) {
            throw new NWSFetchError(url, cause);
        }

        const text = await response.text();
        let json: T | NWSProblemDetails;
        try {
            json = JSON.parse(text);
        } catch (cause) {
            throw new NWSParseError(url, text, cause);
        }

        if (response.ok) {
            return json as T;
        }

        throw new NWSResponseError(
            response.status,
            url,
            json as NWSProblemDetails
        );
    }

    protected abstract get resource(): string;
}
