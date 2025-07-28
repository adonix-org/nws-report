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

export class Products extends NationalWeatherService<Product | undefined> {
    constructor(private readonly type: string, private readonly wfo: string) {
        super();
    }

    /**
     * If the product is not found, the NWS API still returns a JSON
     * object that is mostly empty. If not found, return undefined.
     */
    public override async get(): Promise<Product | undefined> {
        const product = await super.get();
        return product && "productCode" in product ? product : undefined;
    }

    protected override get resource(): string {
        return `/products/types/${this.type}/locations/${this.wfo}/latest`;
    }
}

export interface Product {
    id: string;
    wmoCollectiveId: string;
    issuingOffice: string;
    issuanceTime: string;
    productCode: string;
    productName: string;
    productText: string;
}
