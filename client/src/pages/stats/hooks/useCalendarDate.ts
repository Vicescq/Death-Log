import { useState } from "react";
import type { ChartSpec } from "../../../model/stats-query-model/chart-spec";

function rangeToDate(range: string | undefined): Date {
	if (!range) return new Date();
	const [year, month] = range.split("-").map(Number);
	return new Date(year, month - 1, 1);
}

export function useCalendarDate(spec: ChartSpec) {
	const [currentDate, setCurrentDate] = useState(() =>
		rangeToDate(spec.calendarConfig?.range),
	);

	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, "0");

	return { currentDate, setCurrentDate, year, month };
}
