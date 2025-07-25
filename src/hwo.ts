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

import { Product } from "./products";

const ZONE_REGEX = /([A-Z]{2}Z\d{3}(?:[->\n\dA-Z]*)?-\d{6}-)/;

interface ProductExt {
    product: Product;
    header: string;
    body: string;
    zones: string[];
}

function parse(product: Product): ProductExt[] {
    const productExt: ProductExt[] = [];
    const header = product.productText.slice(
        0,
        ZONE_REGEX.exec(product.productText)?.index
    );

    const products = parseProduct(product.productText);
    products.forEach((body) => {
        const [zones] = body.split(/-\d{6}-/);
        if (zones) {
            productExt.push({
                header,
                product,
                body,
                zones: parseZones(zones.replace(/-\n/g, "-")),
            });
        }
    });
    return productExt;
}

function parseProduct(text: string): string[] {
    const indexArray: number[] = [];
    let match;
    const regex = new RegExp(ZONE_REGEX, "g");
    while ((match = regex.exec(text)) !== null) {
        indexArray.push(match.index);
    }

    const products: string[] = [];
    for (let i = 0; i < indexArray.length; i++) {
        products.push(text.slice(indexArray[i], indexArray[i + 1]));
    }
    return products;
}

function parseZones(text: string): string[] {
    const states = text.split(/(?<=\d)-(?=[A-Z]{2}Z\d{3})/);
    const zones: string[] = [];
    states.forEach((state) => {
        zones.push(...expandState(state));
    });
    return zones;
}

function expandState(state: string): string[] {
    const prefix = state.slice(0, 3);
    const parts = state.slice(3).split("-");
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

const hwo: Product = {
    id: "5768e006-4129-4bdf-945f-5cad2bb4ba7b",
    wmoCollectiveId: "FLUS41",
    issuingOffice: "KBGM",
    issuanceTime: "2025-07-20T01:06:00+00:00",
    productCode: "HWO",
    productName: "Hazardous Weather Outlook",
    productText:
        "\n000\nFLUS41 KBGM 250818\nHWOBGM\n\nHazardous Weather Outlook\nNational Weather Service Binghamton NY\n418 AM EDT Fri Jul 25 2025\n\nNYZ009-015>018-036-037-260830-\nNorthern Oneida-Yates-Seneca-Southern Cayuga-Onondaga-Madison-\nSouthern Oneida-\n418 AM EDT Fri Jul 25 2025\n\nThis Hazardous Weather Outlook is for central New York.\n\n.DAY ONE...Today and tonight.\n\nA cold front will bring scattered showers and thunderstorms today. \nLocally heavy rainfall will be possible in any thunderstorms.\n\n.DAYS TWO THROUGH SEVEN...Saturday through Thursday.\n\nHazardous weather is not expected at this time.\n\n.SPOTTER INFORMATION STATEMENT...\n\nSpotter activation is not expected at this time.\n\n$$\n\nNYZ022>025-044>046-055>057-062-\nPAZ038>040-043-260830-\nSteuben-Schuyler-Chemung-Tompkins-Cortland-Chenango-Otsego-Tioga-\nBroome-Delaware-Sullivan-Bradford-Susquehanna-Northern Wayne-Wyoming-\n418 AM EDT Fri Jul 25 2025\n\nThis Hazardous Weather Outlook is for central New York and \nnortheast Pennsylvania.\n\n.DAY ONE...Today and tonight.\n\nA cold front will bring scattered showers and thunderstorms today, \nespecially during the afternoon. A few of these thunderstorms may \nbecome strong to severe with locally gusty winds and heavy rainfall.\n\n.DAYS TWO THROUGH SEVEN...Saturday through Thursday.\n\nHazardous weather is not expected at this time.\n\n.SPOTTER INFORMATION STATEMENT...\n\nSpotter activation may be needed. Please relay any information about\nsevere weather to the NWS.\n\n$$\n\nPAZ044-047-048-072-260830-\nLackawanna-Luzerne-Pike-Southern Wayne-\n418 AM EDT Fri Jul 25 2025\n\nThis Hazardous Weather Outlook is for northeast Pennsylvania.\n\n.DAY ONE...Today and tonight.\n\nHot and humid conditions are expected today. Peak heat index values\nare expected to be in the mid 90s to near 100.\n\nAlso, a cold front will bring scattered showers and thunderstorms \ntoday, especially during the afternoon. A few of these thunderstorms \nmay become strong to severe with locally gusty winds and heavy \nrainfall.\n\n.DAYS TWO THROUGH SEVEN...Saturday through Thursday.\n\nHazardous weather is not expected at this time.\n\n.SPOTTER INFORMATION STATEMENT...\n\nSpotter activation may be needed. Please relay any information about\nsevere weather to the NWS.\n\n$$\n",
};

const ffa: Product = {
    id: "b8852362-b422-44c3-b006-b7fc936df9cd",
    wmoCollectiveId: "WGUS61",
    issuingOffice: "KBGM",
    issuanceTime: "2025-07-17T03:53:00+00:00",
    productCode: "FFA",
    productName: "Flash Flood Watch",
    productText:
        "\n000\nWGUS61 KBGM 170353\nFFABGM\n\nFlood Watch\nNational Weather Service Binghamton NY\n1153 PM EDT Wed Jul 16 2025\n\nPAZ043-044-047-170500-\n/O.CAN.KBGM.FA.A.0010.000000T0000Z-250717T0400Z/\n/00000.0.ER.000000T0000Z.000000T0000Z.000000T0000Z.OO/\nWyoming-Lackawanna-Luzerne-\nIncluding the cities of Wilkes-Barre, Hazleton, Tunkhannock, and\nScranton\n1153 PM EDT Wed Jul 16 2025\n\n...FLOOD WATCH IS CANCELLED...\n\nThe Flash Flood Watch is cancelled for a portion of northeast \nPennsylvania, including the following areas, Lackawanna, Luzerne and \nWyoming.\n\nFlooding is no longer expected to pose a threat. Please continue to \nheed remaining road closures.\n\n$$\n\nKistner\n",
};
console.log(parse(hwo));

console.log(parse(ffa));
