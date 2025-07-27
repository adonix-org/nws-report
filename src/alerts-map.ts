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
import { SegmentedProduct, SegmentedProducts } from "./segment";
import { Alerts, AlertFeature } from "./alerts";

export class AlertMap {
    private alertMap = new Map<string, SegmentedProduct | undefined>();

    public getProduct(alert: AlertFeature): SegmentedProduct | undefined {
        return this.alertMap.get(alert.properties.id);
    }

    public async refresh(point: Gridpoint, alerts: Alerts) {
        const entries = await Promise.all(
            alerts.features.map(async (item) => {
                const identifiers = item.properties.parameters.AWIPSidentifier;
                const type = identifiers?.[0]?.slice(0, 3);
                const product = type
                    ? await new SegmentedProducts(type, point, true).get()
                    : undefined;
                return [item.properties.id, product] as const;
            })
        );

        this.alertMap.clear();
        this.alertMap = new Map(entries);
    }
}
