import { NationalWeatherService } from "./nws";

export class LatestAlerts extends NationalWeatherService<Alerts> {
    constructor(
        latitude: number,
        longitude: number,
        status: QueryStatus = "actual"
    ) {
        super();
        this.params.set("point", `${latitude},${longitude}`);
        this.params.set("status", status);
    }

    protected override get resource(): string {
        return `/alerts/active`;
    }
}

export interface Alerts {
    type: string;
    features: Feature[];
    title: string;
    updated: string;
}

interface Feature {
    id: string;
    type: string;
    geometry: null;
    properties: Properties;
}

interface Properties {
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
