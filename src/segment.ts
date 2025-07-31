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

import { Product, Products } from "./products";

const ZONE_REGEX = /([A-Z]{2}Z\d{3}(?:[->\n\dA-Z]*)?-\n?\d{6}-)/;

export class SegmentedProducts {
    constructor(
        private readonly type: string,
        private readonly wfo: string,
        private readonly zone: string,
        private readonly filter: boolean
    ) {}

    public async get(): Promise<SegmentedProduct | undefined> {
        const product = await new Products(this.type, this.wfo).get();

        if (!product) {
            return undefined;
        }

        let segmented = new SegmentParser(product).get();

        if (!segmented?.segments.length) {
            return undefined;
        }

        if (this.filter) {
            segmented = this.doFilter(segmented);
            if (!segmented.segments.length) {
                return undefined;
            }
        }

        return segmented;
    }

    protected doFilter(product: SegmentedProduct): SegmentedProduct {
        const filtered = product.segments.filter((segment) =>
            segment.zones.includes(this.zone)
        );

        return { ...product, segments: filtered };
    }
}

export interface SegmentedProduct {
    product: Product;
    header?: string;
    headline?: string;
    segments: ProductSegment[];
}

export interface ProductSegment {
    zoneText: string;
    zones: string[];
    timestamp: string;
    body: string;
}

class SegmentParser {
    constructor(private readonly product: Product) {}

    public get(): SegmentedProduct | undefined {
        if (!this.isSegmented()) {
            return undefined;
        }
        const [header, headline] = this.getHeaders();
        const segmentStrings = this.getSegmentStrings();
        const segments = this.getSegments(segmentStrings);

        return { header, headline, product: this.product, segments };
    }

    private isSegmented(): boolean {
        return ZONE_REGEX.test(this.product.productText);
    }

    private getHeaders(): string[] {
        const zoneMatch = ZONE_REGEX.exec(this.product.productText);
        if (zoneMatch) {
            return this.product.productText
                .slice(0, zoneMatch.index)
                .split(/\n\n+/)
                .map((s) => s.trim())
                .filter(Boolean);
        }
        throw new Error(
            `Unable to find a zoned segment in ${this.product.productText}`
        );
    }

    private getSegmentStrings(): string[] {
        const indexArray: number[] = [];
        let match;
        const regex = new RegExp(ZONE_REGEX, "g");
        while ((match = regex.exec(this.product.productText)) !== null) {
            indexArray.push(match.index);
        }

        const segmentStrings: string[] = [];
        for (let i = 0; i < indexArray.length; i++) {
            segmentStrings.push(
                this.product.productText.slice(indexArray[i], indexArray[i + 1])
            );
        }
        return segmentStrings;
    }

    private getSegments(segmentStrings: string[]): ProductSegment[] {
        const segments: ProductSegment[] = [];
        for (const body of segmentStrings) {
            const match = body.match(/^(.*?)-(\d{6})-/s);
            if (match && match[1] && match[2]) {
                const zoneText = match[1];
                const timestamp = match[2];

                segments.push({
                    body,
                    timestamp,
                    zoneText,
                    zones: ProductZone.getZones(zoneText),
                });
            }
        }
        return segments;
    }
}

class ProductZone {
    public static getZones(zoneText: string): string[] {
        const states = zoneText
            .replaceAll("\n", "")
            .split(/(?<=\d)-(?=[A-Z]{2}Z\d{3})/);
        const zones: string[] = [];
        states.forEach((state) => {
            zones.push(...ProductZone.getStateZones(state));
        });
        return zones;
    }

    public static getStateZones(stateZone: string): string[] {
        const prefix = stateZone.slice(0, 3);
        const parts = stateZone.slice(3).split("-");
        const zones: string[] = [];

        for (const part of parts) {
            const [start, end] = part.split(">").map((s) => {
                const n = parseInt(s.trim(), 10);
                if (Number.isNaN(n) || n > 999) return undefined;
                return n;
            });
            if (start !== undefined && end !== undefined) {
                for (let i = start; i <= end; i++) {
                    zones.push(`${prefix}${i.toString().padStart(3, "0")}`);
                }
            } else if (start !== undefined) {
                zones.push(`${prefix}${start.toString().padStart(3, "0")}`);
            }
        }
        return zones;
    }
}
