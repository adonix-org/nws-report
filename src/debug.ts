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

import { NWSResponseError, WeatherReport } from "../dist/index.js";

try {
    // const point = await new Points(42.1762, -76.8358).get();
    const report = await WeatherReport.create(37.2367, -76.5065);
    console.log(report.alerts);
} catch (error) {
    if (error instanceof NWSResponseError) {
        error.details.parameterErrors?.forEach((value) => {
            console.error(value.message, "parameter:", value.parameter);
        });
    }
}
