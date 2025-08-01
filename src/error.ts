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

abstract class NWSError extends Error {
    constructor(public readonly url: URL, message: string, cause: unknown) {
        super(message, { cause });
        this.name = new.target.name;
    }
}

export class NWSFetchError extends NWSError {
    constructor(url: URL, cause: unknown) {
        super(url, `${url}`, cause);
    }
}

export class NWSParseError extends NWSError {
    constructor(url: URL, text: string, cause: unknown) {
        super(url, `${url} ${text}`, cause);
    }
}

export class NWSResponseError extends Error {
    constructor(
        public readonly url: URL,
        public readonly status: number,
        public readonly details: NWSProblemDetails
    ) {
        super(`${status} ${details.title}: ${url}`);
        this.name = new.target.name;
    }
}

export interface NWSProblemDetails {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    correlationId: string;
    parameterErrors?: NWSParameterError[];
}

interface NWSParameterError {
    parameter: string;
    message: string;
}

export function isNWSProblemDetails(obj: unknown): obj is NWSProblemDetails {
    if (!obj || typeof obj !== "object") return false;

    const o = obj as Record<string, unknown>;

    return (
        typeof o["type"] === "string" &&
        typeof o["title"] === "string" &&
        typeof o["status"] === "number" &&
        typeof o["detail"] === "string" &&
        typeof o["instance"] === "string" &&
        typeof o["correlationId"] === "string"
    );
}

export class HTTPError extends Error {
    constructor(
        public readonly url: URL,
        public readonly status: number,
        public readonly statusText: string
    ) {
        super(`${status} ${statusText}`);
    }
}
