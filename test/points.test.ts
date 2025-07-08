import { expect, test } from "vitest";
import { NWSResponseError, Points } from "../dist";

test("get points should throw NWSResponseError", async () => {
    await expect(new Points(0, 0).get()).rejects.toThrow(NWSResponseError);
});
