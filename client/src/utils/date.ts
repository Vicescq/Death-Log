import z from "zod";
import { CONSTANTS } from "../../shared/constants";
import { assertIsNonNull } from "./asserts";

/**
 * ISO string to standard date format
 * @param isoSTR
 * @returns
 */
export function isoToDateSTD(isoSTR: string) {
	const dateObj = new Date(isoSTR);
	const year = String(dateObj.getFullYear());
	const month = dateObj.getMonth() + 1;
	const day = dateObj.getDate();
	return `${year}-${addLeadingZeroes(month)}-${addLeadingZeroes(day)}`;
}

/**
 * ISO string to standard time format
 * @param isoSTR
 * @returns
 */
export function isoToTimeSTD(isoSTR: string) {
	const dateObj = new Date(isoSTR);
	const hour = dateObj.getHours();
	const mins = dateObj.getMinutes();
	const secs = dateObj.getSeconds();

	return `${addLeadingZeroes(hour)}:${addLeadingZeroes(mins)}:${addLeadingZeroes(secs)}`;
}

/**
 * Standard date time to iso string.
 *
 * @param formattedDateStr
 * @param formattedTimeStr
 * **Note**: pass in 00:00:00 in time param
 * in order to convert an implicit local date string eg. YYYY:MM:DD into iso format
 * in order for consistency in comparsions when using Date.parse()
 * @returns
 */
export function dateTimeSTDToISO(
	formattedDateStr: string,
	formattedTimeStr: string,
) {
	const parsedDate = formattedDateStr.split("-");
	const parsedTime = formattedTimeStr.split(":");
	const dateObj = new Date(
		Number(parsedDate[0]),
		Number(parsedDate[1]) - 1,
		Number(parsedDate[2]),
		Number(parsedTime[0]),
		Number(parsedTime[1]),
		Number(parsedTime[2]),
	);
	return dateObj.toISOString();
}

/**
 * Resolves a given timestamp, determines the correct ISO string to return, ensuring only dirty timestamp inputs are updated.
 * If not used timestamps may be less precise.
 */
export function resolveTimestampUpdate(
	dirtyDate: string | undefined,
	isDirtyDate: boolean,
	dirtyTime: string | undefined,
	isDirtyTime: boolean,
	ogISOTimestamp: string,
) {
	let isoStr: string;
	if (isDirtyDate && isDirtyTime) {
		assertIsNonNull(dirtyDate);
		assertIsNonNull(dirtyTime);
		isoStr = dateTimeSTDToISO(dirtyDate, dirtyTime);
	} else if (isDirtyDate && !isDirtyTime) {
		assertIsNonNull(dirtyDate);
		isoStr = dateTimeSTDToISO(dirtyDate, isoToTimeSTD(ogISOTimestamp));
	} else if (!isDirtyDate && isDirtyTime) {
		assertIsNonNull(dirtyTime);
		isoStr = dateTimeSTDToISO(isoToDateSTD(ogISOTimestamp), dirtyTime);
	} else {
		isoStr = ogISOTimestamp;
	}
	return isoStr;
}

export const DateRangeSchema = z.object({
	dateStart: z.iso.date({ error: CONSTANTS.ERROR.DATE }),
	timeStart: z.iso.time({
		precision: 0,
		error: CONSTANTS.ERROR.TIME,
	}),
	dateEnd: z.iso.date({ error: CONSTANTS.ERROR.DATE }).nullable(),
	timeEnd: z.iso
		.time({ precision: 0, error: CONSTANTS.ERROR.TIME })
		.nullable(),
});

type DateRange = z.infer<typeof DateRangeSchema>;

export function validateDateRange<T extends DateRange>(
	schema: T,
	ctx: z.core.$RefinementCtx,
) {
	// try catch due to superRefine() having possibility of malformed date time strings which throws errors in dateTimeSTDToISO fn
	try {
		if (schema.dateEnd && schema.timeEnd) {
			// have to do this because schema.date (YYYY:MM:DD) has an implcit timezone which is binded to the user where Date.parse does not know about. Need to transform that date into UTC iso string then pass it to .parse()
			const parsedUTCdateTimeStart = Date.parse(
				dateTimeSTDToISO(schema.dateStart, schema.timeStart),
			);
			const parsedUTCdateTimeEnd = Date.parse(
				dateTimeSTDToISO(schema.dateEnd, schema.timeEnd),
			);

			// max for start, min for end, completed
			if (parsedUTCdateTimeStart > parsedUTCdateTimeEnd) {
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATETIME_START_SURPASSED_END,
					path: ["dateStart"],
				});
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATETIME_START_SURPASSED_END,
					path: ["timeStart"],
				});
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATETIME_START_SURPASSED_END,
					path: ["dateEnd"],
				});
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATETIME_START_SURPASSED_END,
					path: ["timeEnd"],
				});
			}

			// max for end
			if (parsedUTCdateTimeEnd > Date.now()) {
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
					path: ["dateEnd"],
				});
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
					path: ["timeEnd"],
				});
			}
		} else {
			const parsedUTCdateTimeStart = Date.parse(
				dateTimeSTDToISO(schema.dateStart, schema.timeStart),
			);

			// max for start, uncompleted
			if (parsedUTCdateTimeStart > Date.now()) {
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
					path: ["dateStart"],
				});
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
					path: ["timeStart"],
				});
			}
		}
	} catch {
		return;
	}
}

export function formatDLExportFile(date: Date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const fileName = `Death Log ${year}_${addLeadingZeroes(month)}_${addLeadingZeroes(day)} ${date.toTimeString()}`;
	return fileName;
}

function addLeadingZeroes(quantity: number): string {
	return quantity >= 10 ? String(quantity) : `0${quantity}`;
}
