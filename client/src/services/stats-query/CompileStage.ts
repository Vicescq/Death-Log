import alasql from "alasql";
import type { EChartsOption } from "echarts";
import type { ChartSpec } from "../../model/stats-query-model/chart-spec";
import type { CategoryPoint } from "../../model/stats-query-model/chart";
import type { Tables } from "./FlattenStage";
import {
	toBarChart,
	toCalendar,
	toLineChart,
	toPieChart,
	toTimeLineChart,
} from "./ChartStage";
import { applyTransform } from "./TransformStage";

type Aggregate = ChartSpec["measure"]["aggregate"];
type Dimension = ChartSpec["dimension"];

type ResolvedMeasure = {
	table: keyof Tables;
	valueExpr: string;
};

export type CompileResult =
	| { status: "ok"; option: EChartsOption }
	| { status: "no-data" }
	| { status: "insufficient"; minDataPoints: number; option: EChartsOption };

/**
 * Compile a ChartSpec into an AlaSQL string, run it against the flattened rows,
 * and hand the result to the matching chart terminal.
 */
export function compileSpec(spec: ChartSpec, tables: Tables): CompileResult {
	const { table, valueExpr } = resolveMeasure(spec.measure);
	const dimCol = resolveDimension(spec.dimension, table, spec.dateTrunc);

	const rows_src = tables[table];
	if (rows_src.length === 0) return { status: "no-data" };

	const sql = buildSql({ dimCol, valueExpr, spec, table });
	const rows = alasql(sql, [rows_src]) as { x: unknown; y: unknown }[];
	if (rows.length === 0) return { status: "no-data" };

	const data: CategoryPoint[] = rows.map((r) => ({
		x: String(r.x),
		y: Number(r.y),
	}));

	const transformed = applyTransform(data, spec.transform);
	const option = render(spec, transformed);

	const threshold = spec.minDataPoints ?? 1;
	if (data.length < threshold)
		return { status: "insufficient", minDataPoints: threshold, option };
	return { status: "ok", option };
}

/** The measure decides which table we query and the y-value aggregate. */
function resolveMeasure(m: ChartSpec["measure"]): ResolvedMeasure {
	switch (m.measure) {
		case "deaths":
			if (m.aggregate === "count")
				return { table: "deaths", valueExpr: "COUNT(*)" };
			return {
				table: "subjects",
				valueExpr: `${aggFn(m.aggregate)}(deaths)`,
			};
		case "timeSpent":
			return {
				table: "subjects",
				valueExpr: `${aggFn(m.aggregate)}(timeSpentMins)`,
			};
		case "subjectCount":
			return { table: "subjects", valueExpr: "COUNT(DISTINCT id)" };
		case "profileCount":
			return {
				table: "subjects",
				valueExpr: "COUNT(DISTINCT profileID)",
			};
		case "gameCount":
			return { table: "subjects", valueExpr: "COUNT(DISTINCT gameID)" };
	}
}

function aggFn(a: Aggregate): string {
	switch (a) {
		case "sum":
			return "SUM";
		case "avg":
			return "AVG";
		case "max":
			return "MAX";
		case "min":
			return "MIN";
		case "count":
			return "COUNT";
	}
}

/** Column names diverge between the deaths and subjects tables. */
function resolveDimension(
	dim: Dimension,
	table: keyof Tables,
	dateTrunc: ChartSpec["dateTrunc"],
): string {
	if (table === "deaths") {
		switch (dim) {
			case "games":
				return "gameName";
			case "profiles":
				return "profileName";
			case "subjects":
				return "subjectName";
			case "context":
				return "subjectContext";
			case "timestampDeath":
				return truncate("timestampLocal", dateTrunc);
			case "dateStart":
			case "dateEnd":
				throw new Error(
					`[DEV] dimension "${dim}" is not valid for the deaths table — UI should not allow this combo`,
				);
		}
	}
	switch (dim) {
		case "games":
			return "gameName";
		case "profiles":
			return "profileName";
		case "subjects":
			return "name";
		case "context":
			return "context";
		case "dateStart":
			return truncate("dateStartLocal", dateTrunc);
		case "dateEnd":
			return truncate("dateEndLocal", dateTrunc);
		case "timestampDeath":
			throw new Error(
				`[DEV] dimension "timestampDeath" is not valid for the subjects table — UI should not allow this combo`,
			);
	}
}

// Assumes ISO strings with a 4-digit year — breaks for years outside 1000–9999.
const TRUNC_LENGTHS: Record<NonNullable<ChartSpec["dateTrunc"]>, number> = {
	day: 10, // "2024-03-15"
	month: 7, // "2024-03"
	year: 4, // "2024"
};

function truncate(col: string, dateTrunc: ChartSpec["dateTrunc"]): string {
	if (!dateTrunc) return col;
	return `SUBSTRING(${col}, 1, ${TRUNC_LENGTHS[dateTrunc]})`;
}

function buildSql({
	dimCol,
	valueExpr,
	spec,
	table,
}: {
	dimCol: string;
	valueExpr: string;
	spec: ChartSpec;
	table: keyof Tables;
}): string {
	const reliabilityClause =
		table === "deaths" && !spec.showUnreliableDeathData
			? "timestampRel = TRUE"
			: "";
	const userWhereClause = compileFilterGroups(spec.where);
	const allWhere = [reliabilityClause, userWhereClause]
		.filter(Boolean)
		.join(" AND ");
	const where = allWhere ? ` WHERE ${allWhere}` : "";

	const havingClause = compileFilterGroups(spec.having);
	const having = havingClause ? ` HAVING ${havingClause}` : "";

	const order = ` ORDER BY ${spec.sort.axis} ${spec.sort.dir.toUpperCase()}`;
	const limit = spec.lim != null ? ` LIMIT ${spec.lim}` : "";
	return (
		`SELECT ${dimCol} AS x, ${valueExpr} AS y FROM ?` +
		where +
		` GROUP BY ${dimCol}` +
		having +
		order +
		limit
	);
}

/**
 * Compiles filter groups into a clause string (no keyword prefix).
 * Within a group, clauses are joined by the group's logicalOp.
 * Groups themselves are always ANDed: (A AND B) AND (C OR D).
 */
function compileFilterGroups(groups: ChartSpec["where"] | ChartSpec["having"]): string {
	if (groups === undefined) return "";
	if (groups.length === 0)
		throw new Error(
			"CompileStage: filter group array must not be empty — omit the field instead",
		);
	const compiled = groups.map((g) => {
		if (g.clauses.length === 0)
			throw new Error(
				"[DEV] FilterGroup has no clauses — UI should not produce empty groups",
			);
		const clauses = g.clauses.map(
			(f) => `${f.field} ${f.operator} ${literal(f.value)}`,
		);
		return clauses.length === 1
			? clauses[0]
			: `(${clauses.join(` ${g.logicalOp} `)})`;
	});
	return compiled.join(" AND ");
}

function literal(v: string | number | boolean): string {
	if (typeof v === "string") return `'${v.replace(/'/g, "''")}'`;
	if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
	return String(v);
}

function render(spec: ChartSpec, data: CategoryPoint[]): EChartsOption {
	switch (spec.type) {
		case "bar":
			return toBarChart(data);
		case "line":
			return toLineChart(data);
		case "pie":
			return toPieChart(data);
		case "time-line":
			return toTimeLineChart(data);
		case "calendar":
			return toCalendar(
				data,
				spec.calendarConfig?.range ?? new Date().toISOString().slice(0, 7),
			);
		case "sunburst":
			throw new Error(`CompileStage: "sunburst" is not yet supported`);
	}
}
