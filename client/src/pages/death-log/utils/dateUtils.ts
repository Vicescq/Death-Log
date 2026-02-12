import { assertIsNonNull } from "../../../utils";

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

/**
 * ISO string to standard date format
 * @param isoSTR 
 * @returns 
 */
export function isoToDateSTD(isoSTR: string) {
	const dateObj = new Date(isoSTR);
	const year = String(dateObj.getFullYear());
	let month = String(dateObj.getMonth() + 1);
	let day = String(dateObj.getDate());
	if (month.length == 1) {
		month = "0" + month;
	}
	if (day.length == 1) {
		day = "0" + day;
	}
	return `${year}-${month}-${day}`;
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

	function addLeadingZeroes(time: number): string {
		return time >= 10 ? String(time) : `0${time}`;
	}

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

export function maxDate(isoSTR: string) {
	const dateObj = new Date(isoSTR);
	dateObj.setFullYear(dateObj.getFullYear() + 1);
	return isoToDateSTD(dateObj.toISOString());
}
