import { expect, test } from "vitest";
import { query } from "../QueryStage";
import type { Tables, DeathRow, SubjectRow } from "../FlattenStage";
import type { ChartSpec } from "../../../model/stats-query-model/chart-spec";

function death(overrides: Partial<DeathRow> = {}): DeathRow {
	return {
		id: "d1",
		timestampLocal: "2024-03-15T10:00:00",
		timestampRel: true,
		remark: null,
		subjectID: "s1",
		subjectName: "Boss",
		subjectContext: "Boss",
		profileID: "p1",
		profileName: "Profile",
		gameID: "g1",
		gameName: "Game",
		...overrides,
	};
}

function subject(overrides: Partial<SubjectRow> = {}): SubjectRow {
	return {
		id: "s1",
		name: "Boss",
		context: "Boss",
		dateStartLocal: "2024-01-01",
		dateStartRel: true,
		dateEndLocal: null,
		dateEndRel: false,
		timeSpent: null,
		completed: false,
		reoccurring: false,
		profileID: "p1",
		profileName: "Profile",
		gameID: "g1",
		gameName: "Game",
		deaths: 1,
		timeSpentMins: 0,
		...overrides,
	};
}

const OPTS = { calendarRange: "2024-03" };

type BarOption = { xAxis: { data: string[] }; series: [{ data: number[] }] };
type TimeLineOption = { series: [{ data: [string, number][] }] };

test("empty table → no-data", () => {
	const spec: ChartSpec = {
		type: "bar",
		title: "T",
		table: "deaths",
		sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ? GROUP BY subjectName",
	};
	expect(query(spec, { deaths: [], subjects: [] }, OPTS).status).toBe(
		"no-data",
	);
});

test("sql returning zero rows → no-data", () => {
	const spec: ChartSpec = {
		type: "bar",
		title: "T",
		table: "deaths",
		sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ? WHERE subjectContext = 'Minion' GROUP BY subjectName",
	};
	expect(
		query(spec, { deaths: [death()], subjects: [] }, OPTS).status,
	).toBe("no-data");
});

test("bar spec groups and counts correctly", () => {
	const tables: Tables = {
		deaths: [
			death({ id: "d1", subjectName: "Boss A" }),
			death({ id: "d2", subjectName: "Boss A" }),
			death({ id: "d3", subjectName: "Boss B" }),
		],
		subjects: [],
	};
	const spec: ChartSpec = {
		type: "bar",
		title: "T",
		table: "deaths",
		sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ? GROUP BY subjectName ORDER BY y DESC",
	};
	const result = query(spec, tables, OPTS);
	expect(result.status).toBe("ok");
	if (result.status !== "ok") return;
	const option = result.option as BarOption;
	expect(option.xAxis.data).toEqual(["Boss A", "Boss B"]);
	expect(option.series[0].data).toEqual([2, 1]);
});

test("subjects table query", () => {
	const tables: Tables = {
		deaths: [],
		subjects: [
			subject({ name: "Malenia", deaths: 10 }),
			subject({ id: "s2", name: "Godrick", deaths: 3 }),
		],
	};
	const spec: ChartSpec = {
		type: "bar",
		title: "T",
		table: "subjects",
		sql: "SELECT name AS x, deaths AS y FROM ? ORDER BY deaths DESC",
	};
	const result = query(spec, tables, OPTS);
	expect(result.status).toBe("ok");
	if (result.status !== "ok") return;
	expect((result.option as BarOption).series[0].data).toEqual([10, 3]);
});

test("below minDataPoints → insufficient with option still present", () => {
	const spec: ChartSpec = {
		type: "bar",
		title: "T",
		table: "deaths",
		sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ? GROUP BY subjectName",
		minDataPoints: 5,
	};
	const result = query(spec, { deaths: [death()], subjects: [] }, OPTS);
	expect(result.status).toBe("insufficient");
	if (result.status !== "insufficient") return;
	expect(result.minDataPoints).toBe(5);
	expect(result.option).toBeDefined();
});

test("meeting minDataPoints → ok", () => {
	const spec: ChartSpec = {
		type: "bar",
		title: "T",
		table: "deaths",
		sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ? GROUP BY subjectName",
		minDataPoints: 1,
	};
	const result = query(spec, { deaths: [death()], subjects: [] }, OPTS);
	expect(result.status).toBe("ok");
});

test("cumulative applies running sum over daily counts", () => {
	const tables: Tables = {
		deaths: [
			death({ id: "d1", timestampLocal: "2024-01-01T00:00:00" }),
			death({ id: "d2", timestampLocal: "2024-01-02T00:00:00" }),
			death({ id: "d3", timestampLocal: "2024-01-03T00:00:00" }),
		],
		subjects: [],
	};
	const spec: ChartSpec = {
		type: "time-line",
		title: "T",
		table: "deaths",
		sql: "SELECT SUBSTRING(timestampLocal,1,10) AS x, COUNT(*) AS y FROM ? GROUP BY SUBSTRING(timestampLocal,1,10) ORDER BY x ASC",
		cumulative: true,
	};
	const result = query(spec, tables, OPTS);
	expect(result.status).toBe("ok");
	if (result.status !== "ok") return;
	const ys = (result.option as TimeLineOption).series[0].data.map(
		(p) => p[1],
	);
	expect(ys).toEqual([1, 2, 3]);
});

test("without cumulative flag each day has its raw count", () => {
	const tables: Tables = {
		deaths: [
			death({ id: "d1", timestampLocal: "2024-01-01T00:00:00" }),
			death({ id: "d2", timestampLocal: "2024-01-02T00:00:00" }),
			death({ id: "d3", timestampLocal: "2024-01-03T00:00:00" }),
		],
		subjects: [],
	};
	const spec: ChartSpec = {
		type: "time-line",
		title: "T",
		table: "deaths",
		sql: "SELECT SUBSTRING(timestampLocal,1,10) AS x, COUNT(*) AS y FROM ? GROUP BY SUBSTRING(timestampLocal,1,10) ORDER BY x ASC",
	};
	const result = query(spec, tables, OPTS);
	expect(result.status).toBe("ok");
	if (result.status !== "ok") return;
	const ys = (result.option as TimeLineOption).series[0].data.map(
		(p) => p[1],
	);
	expect(ys).toEqual([1, 1, 1]);
});

const SUNBURST_SQL =
	"SELECT gameName AS l0, profileName AS l1, subjectName AS l2, COUNT(*) AS y FROM ? GROUP BY gameName, profileName, subjectName";

type SunburstOption = {
	series: [
		{
			data: Array<{
				name: string;
				value: number;
				children: Array<{
					name: string;
					value: number;
					children: Array<{ name: string; value: number }>;
				}>;
			}>;
		},
	];
};

test("sunburst builds nested tree and aggregates values", () => {
	const tables: Tables = {
		deaths: [
			death({
				id: "d1",
				gameName: "Game A",
				profileName: "P1",
				subjectName: "Boss 1",
			}),
			death({
				id: "d2",
				gameName: "Game A",
				profileName: "P1",
				subjectName: "Boss 1",
			}),
			death({
				id: "d3",
				gameName: "Game A",
				profileName: "P1",
				subjectName: "Boss 2",
			}),
			death({
				id: "d4",
				gameName: "Game B",
				profileName: "P2",
				subjectName: "Boss 3",
			}),
		],
		subjects: [],
	};
	const spec: ChartSpec = {
		type: "sunburst",
		title: "T",
		table: "deaths",
		sql: SUNBURST_SQL,
		levels: [
			{ prune: undefined },
			{ prune: undefined },
			{ prune: undefined },
		],
	};
	const result = query(spec, tables, OPTS);
	expect(result.status).toBe("ok");
	if (result.status !== "ok") return;
	const roots = (result.option as SunburstOption).series[0].data;
	expect(roots).toHaveLength(2);
	expect(roots.find((n) => n.name === "Game A")?.value).toBe(3);
	expect(roots.find((n) => n.name === "Game B")?.value).toBe(1);
});

test("sunburst topN prune keeps top N, showOther:true adds Other", () => {
	const tables: Tables = {
		deaths: ["Boss 1", "Boss 1", "Boss 2", "Boss 3", "Boss 4"].map(
			(name, i) =>
				death({
					id: `d${i}`,
					gameName: "Game",
					profileName: "P",
					subjectName: name,
				}),
		),
		subjects: [],
	};
	const spec: ChartSpec = {
		type: "sunburst",
		title: "T",
		table: "deaths",
		sql: SUNBURST_SQL,
		levels: [
			{ prune: undefined },
			{ prune: undefined },
			{ prune: { mode: "topN", topN: 2, threshold: 1, showOther: true } },
		],
	};
	const result = query(spec, tables, OPTS);
	expect(result.status).toBe("ok");
	if (result.status !== "ok") return;
	const subjects = (result.option as SunburstOption).series[0].data[0]
		.children[0].children;
	expect(subjects.map((n) => n.name)).toContain("Other");
	// 2 kept + 1 Other
	expect(subjects).toHaveLength(3);
});

test("sunburst showOther:false omits Other node", () => {
	const tables: Tables = {
		deaths: ["Boss 1", "Boss 1", "Boss 2", "Boss 3"].map((name, i) =>
			death({
				id: `d${i}`,
				gameName: "Game",
				profileName: "P",
				subjectName: name,
			}),
		),
		subjects: [],
	};
	const spec: ChartSpec = {
		type: "sunburst",
		title: "T",
		table: "deaths",
		sql: SUNBURST_SQL,
		levels: [
			{ prune: undefined },
			{ prune: undefined },
			{
				prune: {
					mode: "topN",
					topN: 1,
					threshold: 1,
					showOther: false,
				},
			},
		],
	};
	const result = query(spec, tables, OPTS);
	expect(result.status).toBe("ok");
	if (result.status !== "ok") return;
	const subjects = (result.option as SunburstOption).series[0].data[0]
		.children[0].children;
	expect(subjects.map((n) => n.name)).not.toContain("Other");
	expect(subjects).toHaveLength(1);
});

test("sunburst → no-data when sql returns zero rows", () => {
	const spec: ChartSpec = {
		type: "sunburst",
		title: "T",
		table: "deaths",
		sql: SUNBURST_SQL + " HAVING COUNT(*) > 100",
		levels: [{ prune: undefined }],
	};
	expect(
		query(spec, { deaths: [death()], subjects: [] }, OPTS).status,
	).toBe("no-data");
});
