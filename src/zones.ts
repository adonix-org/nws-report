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

import { Gridpoint } from "./points";

export class ZoneUtil {
    public static getForecastZone(point: Gridpoint) {
        return ZoneUtil.getZone(point.properties.forecastZone);
    }

    public static getFireZone(point: Gridpoint) {
        return ZoneUtil.getZone(point.properties.fireWeatherZone);
    }

    public static getCounty(point: Gridpoint) {
        return ZoneUtil.getZone(point.properties.county);
    }

    public static getZone(text: string): string {
        const match = /[A-Z]{2}[ZC]\d{3}/.exec(text);
        if (match) {
            return match[0];
        }
        throw new Error(`Unable to find a zone in ${text}`);
    }
}
