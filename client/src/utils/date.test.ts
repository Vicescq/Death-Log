import { expect, test } from "vitest";
import { dateTimeSTDToISO, isoToDateSTD, isoToTimeSTD, resolveTimestampUpdate } from "./date";

/**
 * Note that the timezone in vitest cfg is set to Mountain time.
 */

test("isoToDateSTD outputs correctly", () => {
	// random dates
	expect(isoToDateSTD("2020-01-01T00:00:00.000Z")).toBe("2019-12-31");
	expect(isoToDateSTD("2100-03-15T03:30:00.000Z")).toBe("2100-03-14");

	// DST in mountain time
	expect(isoToDateSTD("2024-03-10T09:00:00.000Z")).toBe("2024-03-10");
});

test("isoToTimeSTD outputs correctly", () => {
	expect(isoToTimeSTD("2020-01-01T00:00:00.000Z")).toBe("17:00:00");
	expect(isoToTimeSTD("2100-03-15T03:30:00.000Z")).toBe("21:30:00");
});

test("dateTimeSTDToISO outputs correctly", () => {
	expect(dateTimeSTDToISO("2019-12-31", "17:00:00")).toBe(
		"2020-01-01T00:00:00.000Z",
	);
	expect(dateTimeSTDToISO("2100-03-14", "21:30:00")).toBe(
		"2100-03-15T03:30:00.000Z",
	);
});

// test("resolveTimestampUpdate outputs correctly", () => {
// 	expect(resolveTimestampUpdate("2019-12-31", "17:00:00")).toBe(
// 		"2020-01-01T00:00:00.000Z",
// 	);
// });