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

function parse(product: Product): void {
    const delimiter = "\n\n";
    let start = product.productText.indexOf(delimiter);
    let end = product.productText.indexOf(delimiter, start + delimiter.length);
    const heading = product.productText.slice(start + delimiter.length, end);
    console.log(heading);
    console.log();

    start = end + delimiter.length;

    const products = product.productText
        .slice(start)
        .split("$$")
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .filter((s) => /^[A-Z]{2}Z\d{3}/.test(s))
        .map((s) => s + "\n\n$$\n");

    products.forEach((value) => {
        const line = value.replace(/-\n/g, "-");
        let [zone] = line.split("\n");
        if (zone) {
            [zone] = zone.split(/-\d{6}-/);
            if (zone) {
                parseZone(zone);
            }
        }
    });
}

function parseZone(raw: string): void {
    const zones = raw.split(/(?<=\d)-(?=[A-Z]{2}Z\d{3})/);
    const arr: string[] = [];
    zones.forEach((value) => {
        arr.push(...expandZones(value));
    });
    console.log(raw);
    console.log(arr);
}

function expandZones(raw: string): string[] {
    const prefix = raw.slice(0, 3);
    const parts = raw.slice(3).split("-");
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
        "\n000\nFLUS41 KBGM 200106\nHWOBGM\n\nHazardous Weather Outlook\nNational Weather Service Binghamton NY\n906 PM EDT Sat Jul 19 2025\n\nNYZ023>025-044>046-055>057-062-PAZ038>040-043-044-047-048-072-210115-\nSchuyler-Chemung-Tompkins-Cortland-Chenango-Otsego-Tioga-Broome-\nDelaware-Sullivan-Bradford-Susquehanna-Northern Wayne-Wyoming-\nLackawanna-Luzerne-Pike-Southern Wayne-\n906 PM EDT Sat Jul 19 2025\n\nThis Hazardous Weather Outlook is for central New York and \nnortheast Pennsylvania.\n\n.DAY ONE...Tonight.\n\nHazardous weather is not expected at this time.\n\n.DAYS TWO THROUGH SEVEN...Sunday through Friday.\n\nScattered showers and thunderstorms are expected on Sunday. A few \nthunderstorms may turn severe and also a few locations could \nexperience excessive rainfall and localized flash flooding.\n\n.SPOTTER INFORMATION STATEMENT...\n\nWeather spotters are encouraged to report significant weather\nconditions according to Standard Operating Procedures. Please relay\nany information about severe weather to the NWS.\n\n$$\n\nNYZ009-015>018-022-036-037-210115-\nNorthern Oneida-Yates-Seneca-Southern Cayuga-Onondaga-Steuben-\nMadison-Southern Oneida-\n906 PM EDT Sat Jul 19 2025\n\nThis Hazardous Weather Outlook is for central New York.\n\n.DAY ONE...Tonight.\n\nNo hazardous weather is expected at this time.\n\n.DAYS TWO THROUGH SEVEN...Sunday through Friday.\n\nThe probability for widespread hazardous weather is low.\n\n.SPOTTER INFORMATION STATEMENT...\n\nSpotter activation is not expected at this time.\n\n$$\n",
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
parse(hwo);
parse(ffa);
