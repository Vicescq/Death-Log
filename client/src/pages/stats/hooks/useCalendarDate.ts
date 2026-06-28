import { useState } from "react";

export function useCalendarDate(initialMonth?: string) {
	const [currentDate, setCurrentDate] = useState(() =>
		parseMonth(initialMonth),
	);

	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, "0");

	return { currentDate, setCurrentDate, year, month };
}

function parseMonth(month?: string): Date {
	if (!month) return new Date();
	const match = /^(\d{4})-(\d{2})$/.exec(month);
	if (!match) return new Date();
	const monthIndex = Number(match[2]) - 1;
	if (monthIndex < 0 || monthIndex > 11) return new Date();
	return new Date(Number(match[1]), monthIndex, 1);
}
