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

import { Geometry } from "geojson";
import { QuantitativeValue } from "./common";
import { NationalWeatherService } from "./nws";

export class Points extends NationalWeatherService<Gridpoint> {
    constructor(
        private readonly latitude: number,
        private readonly longitude: number
    ) {
        super();
    }

    protected override get resource(): string {
        return `/points/${this.latitude},${this.longitude}`;
    }
}

export interface Gridpoint {
    id: string;
    type: string;
    geometry: Geometry;
    properties: GridpointProperties;
}

interface GridpointProperties {
    "@id": string;
    "@type": string;
    cwa: string;
    forecastOffice: string;
    gridId: string;
    gridX: number;
    gridY: number;
    forecast: string;
    forecastHourly: string;
    forecastGridData: string;
    observationStations: string;
    relativeLocation: RelativeLocation;
    forecastZone: string;
    county: string;
    fireWeatherZone: string;
    timeZone: string;
    radarStation: string;
}

interface RelativeLocation {
    type: string;
    geometry: Geometry;
    properties: RelativeLocationProperties;
}

interface RelativeLocationProperties {
    city: string;
    state: string;
    distance: QuantitativeValue;
    bearing: QuantitativeValue;
}
