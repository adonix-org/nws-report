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
import { NationalWeatherService } from "./nws";
import { Gridpoint } from "./points";
import { ZoneUtil } from "./zones";
import { SegmentedProduct, SegmentedProducts } from "./segment";

export class LatestAlerts<
    A extends Alerts = Alerts
> extends NationalWeatherService<A> {
    constructor(
        protected readonly point: Gridpoint,
        status: QueryStatus = "actual"
    ) {
        super();
        this.params.set("zone", `${ZoneUtil.getForecastZone(this.point)}`);
        this.params.set("status", status);
    }

    public override async get(): Promise<A> {
        const alerts = await super.get();
        alerts.features = this.filter(alerts.features);
        return alerts;
    }

    protected override get resource(): string {
        return `/alerts/active`;
    }

    protected filter(features: AlertFeature[]): AlertFeature[] {
        // Remove alerts with the same ID.
        const ids = new Set<string>();
        return features.filter((feature) => {
            if (ids.has(feature.properties.id)) {
                return false;
            }
            ids.add(feature.properties.id);
            return true;
        });
    }
}

export class LatestAlertsProducts extends LatestAlerts<AlertsProducts> {
    public override async get(): Promise<AlertsProducts> {
        const alerts = await super.get();
        const products = await this.fetchProducts(alerts);
        for (const feature of alerts.features) {
            const awips = LatestAlertsProducts.getAwipsId(feature);
            feature.product = products.get(awips);
        }
        return alerts;
    }

    private async fetchProducts(
        alerts: Alerts
    ): Promise<Map<string, SegmentedProduct>> {
        const products = new Map<string, SegmentedProduct>();
        const types = new Set<string>();
        for (const feature of alerts.features) {
            types.add(LatestAlertsProducts.getAwipsId(feature));
        }
        await Promise.all(
            [...types].map(async (awips) => {
                const product = await new SegmentedProducts(
                    awips.slice(0, 3),
                    awips.slice(3),
                    ZoneUtil.getForecastZone(this.point),
                    true
                ).get();
                if (product) {
                    products.set(awips, product);
                }
            })
        );
        return products;
    }

    public static getAwipsId(feature: AlertFeature): string {
        const awipsId = feature.properties.parameters.AWIPSidentifier?.[0];
        if (!awipsId) {
            throw new Error("Missing AWIPS ID");
        }

        if (!/^[A-Z]{5,6}$/.test(awipsId)) {
            throw new Error(`Invalid AWIPS ID: ${awipsId}`);
        }
        return awipsId;
    }
}

export interface AlertsProducts extends Alerts {
    features: AlertFeatureProduct[];
}

export interface AlertFeatureProduct extends AlertFeature {
    product?: SegmentedProduct;
}

export interface Alerts {
    type: string;
    features: AlertFeature[];
    title: string;
    updated: string;
}

export interface AlertFeature {
    id: string;
    type: string;
    geometry?: Geometry | null;
    properties: AlertProperties;
}

interface AlertProperties {
    "@id": string;
    "@type": string;
    id: string;
    areaDesc: string;
    geocode: Geocode;
    affectedZones: string[];
    references: Reference[];
    sent: string;
    effective: string;
    onset: string;
    expires: string;
    ends: string;
    status: AlertStatus;
    messageType: AlertMessageType;
    category: AlertCategory;
    severity: AlertSeverity;
    certainty: AlertCertainty;
    urgency: AlertUrgency;
    event: string;
    sender: string;
    senderName: string;
    headline: string;
    description: string;
    instruction: string;
    response: AlertResponse;
    parameters: AlertParameters;
    scope: AlertScope;
    code: string;
    language: string;
    web: string;
    eventCode: EventCode;
}

interface Geocode {
    SAME: string[];
    UGC: string[];
}

interface Reference {
    "@id": string;
    identifier: string;
    sender: string;
    sent: string;
}

interface CustomCode {
    [key: string]: string[] | undefined;
}

interface EventCode extends CustomCode {
    SAME?: string[];
    NationalWeatherService?: string[];
}

interface AlertParameters extends CustomCode {
    AWIPSidentifier?: string[];
    WMOidentifier?: string[];
    NWSheadline?: string[];
    BLOCKCHANNEL?: string[];
    "EAS-ORG"?: string[];
    VTEC?: string[];
    eventEndingTime?: string[];
    expiredReferences?: string[];
}

type AlertStatus = "Actual" | "Exercise" | "System" | "Test" | "Draft";
type QueryStatus = Lowercase<AlertStatus>;

type AlertMessageType = "Alert" | "Update" | "Cancel" | "Ack" | "Error";
type AlertCategory =
    | "Met"
    | "Geo"
    | "Safety"
    | "Security"
    | "Rescue"
    | "Fire"
    | "Health"
    | "Env"
    | "Transport"
    | "Infra"
    | "CBRNE"
    | "Other";
type AlertSeverity = "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";
type AlertCertainty =
    | "Observed"
    | "Likely"
    | "Possible"
    | "Unlikely"
    | "Unknown";
type AlertUrgency = "Immediate" | "Expected" | "Future" | "Past" | "Unknown";
type AlertResponse =
    | "Shelter"
    | "Evacuate"
    | "Prepare"
    | "Execute"
    | "Avoid"
    | "Monitor"
    | "Assess"
    | "AllClear"
    | "None";
type AlertScope = "Public" | "Restricted" | "Private";
