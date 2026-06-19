import z from "zod";
import { CONSTANTS } from "../../../shared/constants";

export const CHART_TYPES = [
	"bar",
	"pie",
	"line",
	"time-line",
	"calendar",
	"sunburst",
] as const;

export type ChartType = (typeof CHART_TYPES)[number];

const DIMENSIONS = [
	"games",
	"profiles",
	"subjects",
	"context",
	"dateStart",
	"dateEnd",
	"timestampDeath",
] as const;

const MEASURES = [
	"deaths",
	"timeSpent",
	"gameCount",
	"profileCount",
	"subjectCount",
] as const;

const MeasureSchema = z.object({
	measure: z.enum(MEASURES),
	aggregate: z.enum(["sum", "count", "avg", "max", "min"]),
});

const FILTER_OPERATORS = ["<", "<=", "=", "!=", ">", ">="] as const;

const ChartSpecFilterSchema = z.object({
	operator: z.enum(FILTER_OPERATORS),
	field: z.string(),
	value: z.union([z.string(), z.number(), z.boolean()]),
});

const ChartSpecFilterGroupSchema = z.object({
	logicalOp: z.enum(["AND", "OR"]),
	clauses: z.array(ChartSpecFilterSchema),
});

const ChartSpecSortSchema = z.object({
	axis: z.enum(["x", "y"]),
	dir: z.enum(["asc", "desc"]),
});

const TRANSFORMS = ["cumulative"] as const;
const DATE_TRUNCS = ["day", "month", "year"] as const;

const CalendarConfigSchema = z.object({
	range: z.string(), // "YYYY-MM"
});

export const ChartSpecSchema = z.object({
	type: z.enum(CHART_TYPES),
	dimension: z.enum(DIMENSIONS),
	dateTrunc: z.enum(DATE_TRUNCS).optional(),
	measure: MeasureSchema,
	where: z.array(ChartSpecFilterGroupSchema).optional(),
	having: z.array(ChartSpecFilterGroupSchema).optional(),
	sort: ChartSpecSortSchema,
	lim: z.number().optional(),
	transform: z.enum(TRANSFORMS).optional(),
	title: z.string().min(1).max(CONSTANTS.NUMS.INPUT_MAX),
	minDataPoints: z.number().optional(),
	calendarConfig: CalendarConfigSchema.optional(),
	showUnreliableDeathData: z.boolean().optional(),
});

export type ChartSpec = z.infer<typeof ChartSpecSchema>;
export type ChartSpecFilterGroup = z.infer<typeof ChartSpecFilterGroupSchema>;
export type ChartSpecFilter = z.infer<typeof ChartSpecFilterSchema>;

// INVALID COMBOS are validated in the build UI instead
