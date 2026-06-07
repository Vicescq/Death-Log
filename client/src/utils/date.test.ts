import { expect, test, vi } from "vitest";
import {
	dateTimeSTDToISO,
	isoToDateSTD,
	isoToTimeSTD,
	validateDateRange,
	type DateRange,
} from "./date";
import type z from "zod";
import { CONSTANTS } from "../../shared/constants";

/**
 * Note that the timezone in vitest cfg is set to Mountain time.
 */

test("isoToDateSTD outputs correctly", () => {
	// random dates
	expect(isoToDateSTD("2020-01-01T00:00:00.000Z")).toBe("2019-12-31");
	expect(isoToDateSTD("2100-03-15T03:30:00.000Z")).toBe("2100-03-14");
});

test("isoToDateSTD DST edge case", () => {
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

test("validateDateRange | Future Day errors", () => {
	const mockedCtx: z.RefinementCtx = {
		addIssue: vi.fn(),
		issues: [],
		value: 1,
	};
	const schema: DateRange = {
		dateStart: "2021-01-01",
		dateStartRel: true,
		dateEnd: null,
		dateEndRel: true,
		timeStart: "00:00:00",
		timeEnd: null,
	};
	vi.spyOn(Date, "now").mockReturnValue(1577836800000); // 2020-01-01T00:00:00 in epoch

	validateDateRange(schema, mockedCtx);

	expect(mockedCtx.addIssue).toHaveBeenCalledTimes(2);
	expect(mockedCtx.addIssue).toHaveBeenNthCalledWith(1, {
		code: "custom",
		message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
		path: ["dateStart"],
	});
	expect(mockedCtx.addIssue).toHaveBeenNthCalledWith(2, {
		code: "custom",
		message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
		path: ["timeStart"],
	});
});

test("validateDateRange | Start and completion conflict + future date", () => {
	const mockedCtx: z.RefinementCtx = {
		addIssue: vi.fn(),
		issues: [],
		value: 1,
	};
	const schema: DateRange = {
		dateStart: "2021-01-01",
		dateStartRel: true,
		dateEnd: "2020-01-01",
		dateEndRel: true,
		timeStart: "00:00:00",
		timeEnd: "00:00:00",
	};
	vi.spyOn(Date, "now").mockReturnValue(1577836800000); // 2020-01-01T00:00:00 in epoch

	validateDateRange(schema, mockedCtx);

	expect(mockedCtx.addIssue).toHaveBeenCalledTimes(6);
	expect(mockedCtx.addIssue).toHaveBeenNthCalledWith(1, {
		code: "custom",
		message: CONSTANTS.ERROR.DATETIME_START_SURPASSED_END,
		path: ["dateStart"],
	});
	expect(mockedCtx.addIssue).toHaveBeenNthCalledWith(2, {
		code: "custom",
		message: CONSTANTS.ERROR.DATETIME_START_SURPASSED_END,
		path: ["timeStart"],
	});
	expect(mockedCtx.addIssue).toHaveBeenNthCalledWith(3, {
		code: "custom",
		message: CONSTANTS.ERROR.DATETIME_START_SURPASSED_END,
		path: ["dateEnd"],
	});
	expect(mockedCtx.addIssue).toHaveBeenNthCalledWith(4, {
		code: "custom",
		message: CONSTANTS.ERROR.DATETIME_START_SURPASSED_END,
		path: ["timeEnd"],
	});
	expect(mockedCtx.addIssue).toHaveBeenNthCalledWith(5, {
		code: "custom",
		message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
		path: ["dateEnd"],
	});
	expect(mockedCtx.addIssue).toHaveBeenNthCalledWith(6, {
		code: "custom",
		message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
		path: ["timeEnd"],
	});
});

test("validateDateRange | Invalid date, enters catch block", () => {
	const mockedCtx: z.RefinementCtx = {
		addIssue: vi.fn(),
		issues: [],
		value: 1,
	};
	const schema: DateRange = {
		dateStart: "invalid date",
		dateStartRel: true,
		dateEnd: null,
		dateEndRel: true,
		timeStart: "00:00:00",
		timeEnd: null,
	};
	vi.spyOn(Date, "now").mockReturnValue(1577836800000); // 2020-01-01T00:00:00 in epoch

	validateDateRange(schema, mockedCtx);

	expect(mockedCtx.addIssue).not.toHaveBeenCalled();
});

test("validateDateRange | valid date", () => {
	const mockedCtx: z.RefinementCtx = {
		addIssue: vi.fn(),
		issues: [],
		value: 1,
	};
	const schema: DateRange = {
		dateStart: "2000-01-01",
		dateStartRel: true,
		dateEnd: null,
		dateEndRel: true,
		timeStart: "00:00:00",
		timeEnd: null,
	};
	vi.spyOn(Date, "now").mockReturnValue(1577836800000); // 2020-01-01T00:00:00 in epoch

	validateDateRange(schema, mockedCtx);

	expect(mockedCtx.addIssue).not.toHaveBeenCalled();
});
