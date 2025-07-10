import { describe, expect, test } from "vitest";
import { Units } from "../src/units";
import { QuantitativeValue } from "../src/common";

describe("Units.to_number", () => {
    test("returns 0 when value is 0", () => {
        const qv: QuantitativeValue = { unitCode: "F", value: 0 };
        expect(Units.to_number(qv)).toBe(0);
    });

    test("returns undefined when input is undefined", () => {
        expect(Units.to_number(undefined)).toBeUndefined();
    });

    test("returns undefined when value is null", () => {
        const qv: QuantitativeValue = { unitCode: "F", value: null };
        expect(Units.to_number(qv)).toBeUndefined();
    });

    test("returns value when value is a number", () => {
        const qv: QuantitativeValue = { unitCode: "F", value: 72 };
        expect(Units.to_number(qv)).toBe(72);
    });
});
