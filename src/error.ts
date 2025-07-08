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
    constructor(url: URL, public readonly text: string, cause: unknown) {
        super(url, `${url} ${text}`, cause);
    }
}

export class NWSResponseError extends Error {
    constructor(
        public readonly status: number,
        public readonly url: URL,
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
