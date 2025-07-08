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

import { Point } from "geojson";
import { QuantitativeValue } from "./common";
import { NationalWeatherService } from "./nws";
import { Gridpoint } from "./points";

export class Stations extends NationalWeatherService<StationCollection> {
    constructor(private readonly point: Gridpoint, limit = 1) {
        super();

        this.params.set("limit", String(limit));

        // https://www.weather.gov/documentation/services-web-api
        this.headers.append("Feature-Flags", "obs_station_provider");
    }

    protected override get resource(): string {
        const { gridId, gridX, gridY } = this.point.properties;
        return `/gridpoints/${gridId}/${gridX},${gridY}/stations`;
    }
}

export interface StationCollection {
    type: string;
    features: Station[];
    observationStations: string[];
    pagination: Pagination;
}

export interface Station {
    id: string;
    type: string;
    geometry: Point;
    properties: StationProperties;
}

interface StationProperties {
    id: string;
    type: string;
    elevation: QuantitativeValue;
    stationIdentifier: string;
    name: string;
    timeZone: string;
    provider: string;
    subProvider: string;
    distance: QuantitativeValue;
    bearing: QuantitativeValue;
    forecast: string;
    county: string;
    fireWeatherZone: string;
}

interface Pagination {
    next: string;
}
