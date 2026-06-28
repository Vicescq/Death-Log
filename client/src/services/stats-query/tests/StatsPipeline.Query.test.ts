import { expect, test } from "vitest";
import { StatsPipeline } from "../StatsPipeline";
import type {
	Tables,
	DeathRow,
	SubjectRow,
} from "../../../model/stats-query-model/chart";
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

test("empty table → empty category points", () => {
	const spec: ChartSpec = {
		type: "bar",
		title: "T",
		table: "deaths",
		sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ? GROUP BY subjectName",
	};
	const result = StatsPipeline.Query(spec, { deaths: [], subjects: [] });
	expect(result.kind).toBe("category");
	if (result.kind !== "category") return;
	expect(result.points).toEqual([]);
});

test("sql returning zero rows → empty category points", () => {
	const spec: ChartSpec = {
		type: "bar",
		title: "T",
		table: "deaths",
		sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ? WHERE subjectContext = 'Minion' GROUP BY subjectName",
	};
	const result = StatsPipeline.Query(spec, {
		deaths: [death()],
		subjects: [],
	});
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([]);
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
	const result = StatsPipeline.Query(spec, tables);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([
		{ x: "Boss A", y: 2 },
		{ x: "Boss B", y: 1 },
	]);
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
	const result = StatsPipeline.Query(spec, tables);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points.map((p) => p.y)).toEqual([10, 3]);
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
	const result = StatsPipeline.Query(spec, tables);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points.map((p) => p.y)).toEqual([1, 2, 3]);
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
	const result = StatsPipeline.Query(spec, tables);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points.map((p) => p.y)).toEqual([1, 1, 1]);
});

const SUNBURST_SQL =
	"SELECT gameName AS l0, profileName AS l1, subjectName AS l2, COUNT(*) AS y FROM ? GROUP BY gameName, profileName, subjectName";

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
	const result = StatsPipeline.Query(spec, tables);
	if (result.kind !== "sunburst") throw new Error("expected sunburst");
	const roots = result.nodes;
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
	const result = StatsPipeline.Query(spec, tables);
	if (result.kind !== "sunburst") throw new Error("expected sunburst");
	const subjects = result.nodes[0].children[0].children;
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
	const result = StatsPipeline.Query(spec, tables);
	if (result.kind !== "sunburst") throw new Error("expected sunburst");
	const subjects = result.nodes[0].children[0].children;
	expect(subjects.map((n) => n.name)).not.toContain("Other");
	expect(subjects).toHaveLength(1);
});

test("sunburst → empty nodes when sql returns zero rows", () => {
	const spec: ChartSpec = {
		type: "sunburst",
		title: "T",
		table: "deaths",
		sql: SUNBURST_SQL + " HAVING COUNT(*) > 100",
		levels: [{ prune: undefined }],
	};
	const result = StatsPipeline.Query(spec, {
		deaths: [death()],
		subjects: [],
	});
	if (result.kind !== "sunburst") throw new Error("expected sunburst");
	expect(result.nodes).toEqual([]);
});
