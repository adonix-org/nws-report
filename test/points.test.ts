import { expect, test } from "vitest";
import { NWSResponseError } from "../src/error";
import { Points } from "../src/points";

test("get points should throw NWSResponseError", async () => {
    await expect(new Points(0, 0).get()).rejects.toThrow(NWSResponseError);
});
