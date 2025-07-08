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

import { NationalWeatherService } from "./nws";
import { QuantitativeValue } from "./common";
import { Polygon } from "geojson";
import { Gridpoint } from "./points";

abstract class BaseGridpointForecast<T> extends NationalWeatherService<T> {
    constructor(private readonly point: Gridpoint) {
        super();

        // https://www.weather.gov/documentation/services-web-api
        this.headers.append(
            "Feature-Flags",
            "forecast_temperature_qv, forecast_wind_speed_qv"
        );
    }

    protected abstract get endpoint(): string;

    protected override get resource(): string {
        const { gridId, gridX, gridY } = this.point.properties;
        return `/gridpoints/${gridId}/${gridX},${gridY}/${this.endpoint}`;
    }
}

export class DailyForecast extends BaseGridpointForecast<GridpointDailyForecast> {
    protected get endpoint(): string {
        return "forecast";
    }
}

export class HourlyForecast extends BaseGridpointForecast<GridpointHourlyForecast> {
    protected get endpoint(): string {
        return "forecast/hourly";
    }
}

export type GridpointDailyForecast = Forecast<GridpointDailyForecastPeriod>;
export type GridpointHourlyForecast = Forecast<GridpointHourlyForecastPeriod>;

interface Forecast<P extends ForecastPeriod> {
    type: string;
    geometry: Polygon;
    properties: GridpointForecast<P>;
}

interface GridpointForecast<P extends ForecastPeriod> {
    units: string;
    forecastGenerator: string;
    generatedAt: string;
    updateTime: string;
    validTimes: string;
    elevation: QuantitativeValue;
    periods: P[];
}

export interface ForecastPeriod {
    number: number;
    name: string;
    startTime: string;
    endTime: string;
    isDaytime: boolean;
    temperature: QuantitativeValue;
    temperatureTrend: string;
    windSpeed: QuantitativeValue;
    windDirection: string;
    windGust: QuantitativeValue | null;
    icon: string;
    shortForecast: string;
    detailedForecast: string;
    probabilityOfPrecipitation: QuantitativeValue;
}

interface GridpointDailyForecastPeriod extends ForecastPeriod {}

interface GridpointHourlyForecastPeriod extends ForecastPeriod {
    dewpoint: QuantitativeValue;
    relativeHumidity: QuantitativeValue;
}
