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

import { DailyForecast, GridpointDailyForecast } from "./forecast.js";
import { LatestObservation, Observation } from "./observation.js";
import { Gridpoint, Points } from "./points.js";
import { Station, StationCollection, Stations } from "./stations.js";

export class WeatherReport {
    private _point?: Gridpoint;
    private _stations?: StationCollection;
    private _station?: Station;
    private _current?: Observation;
    private _forecast?: GridpointDailyForecast;

    public static async create(
        latitude: number,
        longitude: number
    ): Promise<WeatherReport> {
        const instance = new WeatherReport(latitude, longitude);
        await instance.update();
        return instance;
    }

    private constructor(
        private readonly latitude: number,
        private readonly longitude: number
    ) {}

    public get point() {
        return this._point;
    }

    public get stations() {
        return this._stations;
    }

    public get station() {
        return this._station;
    }

    public get current() {
        return this._current;
    }

    public get forecast() {
        return this._forecast;
    }

    private async update(): Promise<void> {
        this._point = await new Points(this.latitude, this.longitude).get();
        this._stations = await new Stations(this._point).get();

        const [station] = this._stations.features;
        if (station) {
            this._station = station;
            this._current = await new LatestObservation(
                this._station.properties.stationIdentifier
            ).get();
        }
        this._forecast = await new DailyForecast(this._point).get();
    }
}
