import { useState } from "react";

/** Calendar charts always open on the current month; the user navigates from there. */
export function useCalendarDate() {
	const [currentDate, setCurrentDate] = useState(() => new Date());

	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, "0");

	return { currentDate, setCurrentDate, year, month };
}
