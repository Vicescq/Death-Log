import { beforeEach, expect, test, vi } from "vitest";
import LocalDB from "../../LocalDB";
import { CollectionStage } from "../CollectionStage";
import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";
import type {
	Death,
	Subject,
	SubjectContext,
} from "../../../model/tree-node-model/SubjectSchema";
import type { Profile } from "../../../model/tree-node-model/ProfileSchema";
import type { Game } from "../../../model/tree-node-model/GameSchema";
import type { Query } from "../../../model/stats-query-model/query";

vi.mock("../../LocalDB", () => ({
	default: { getChartOverride: vi.fn() },
}));

const mockGet = vi.mocked(LocalDB.getChartOverride);

beforeEach(() => {
	vi.clearAllMocks();
	mockGet.mockReturnValue({});
});

const ISO = "2024-01-01T00:00:00.000Z";

function mkDeath(id: string, reliable: boolean): Death {
	return {
		id,
		parentID: "sub",
		timestamp: ISO,
		timestampRel: reliable,
		remark: null,
	};
}

function mkSubject(
	id: string,
	name: string,
	context: SubjectContext,
	reliable: number,
	unreliable = 0,
	parentID = "p1",
): Subject {
	const log: Death[] = [
		...Array.from({ length: reliable }, (_, i) =>
			mkDeath(`${id}r${i}`, true),
		),
		...Array.from({ length: unreliable }, (_, i) =>
			mkDeath(`${id}u${i}`, false),
		),
	];
	return {
		type: "subject",
		id,
		parentID,
		childIDS: [],
		name,
		completed: false,
		notes: "",
		dateStart: ISO,
		dateEnd: null,
		dateStartRel: true,
		dateEndRel: false,
		isFake: false,
		log,
		reoccurring: false,
		context,
		timeSpent: null,
	};
}

function mkProfile(id: string, childIDS: string[], parentID = "g1"): Profile {
	return {
		type: "profile",
		id,
		parentID,
		childIDS,
		name: id,
		completed: false,
		notes: "",
		dateStart: ISO,
		dateEnd: null,
		dateStartRel: true,
		dateEndRel: false,
		isFake: false,
		groupings: [],
	};
}

function mkGame(id: string, childIDS: string[]): Game {
	return {
		type: "game",
		id,
		parentID: "ROOT_NODE",
		childIDS,
		name: id,
		completed: false,
		notes: "",
		dateStart: ISO,
		dateEnd: null,
		dateStartRel: true,
		dateEndRel: false,
		isFake: false,
	};
}

function treeOf(...nodes: (Subject | Profile | Game)[]): Tree {
	return new Map(nodes.map((n) => [n.id, n]));
}

const bossQuery: Query = {
	id: "top-bosses",
	title: "T",
	description: "",
	method: "bossDeathsBySubject",
	chartType: "bar",
	scope: [],
	reliability: { field: "timestamp", isTemporal: true },
};

test("collects Boss subjects only, sorted by death count ascending", () => {
	const tree = treeOf(
		mkSubject("s1", "Malenia", "Boss", 5),
		mkSubject("s2", "Radahn", "Boss", 8),
		mkSubject("s3", "A Field", "Location", 100), // non-Boss, excluded
	);
	const result = CollectionStage.collect(bossQuery, tree);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([
		{ x: "Malenia", y: 5 },
		{ x: "Radahn", y: 8 },
	]);
});

test("groups same-named bosses across profiles case-insensitively, title-cased for display", () => {
	const tree = treeOf(
		mkSubject("s1", "mAlEniA", "Boss", 2, 0, "p1"),
		mkSubject("s2", "malenia", "Boss", 3, 0, "p2"),
	);
	const result = CollectionStage.collect(bossQuery, tree);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([{ x: "Malenia", y: 5 }]);
});

test("title-cases every word of a multi-word boss name", () => {
	const tree = treeOf(mkSubject("s1", "dark sun GWYNDOLIN", "Boss", 4));
	const result = CollectionStage.collect(bossQuery, tree);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([{ x: "Dark Sun Gwyndolin", y: 4 }]);
});

test("caps at the top 5 deadliest, ascending (deadliest last)", () => {
	const tree = treeOf(
		mkSubject("s1", "A", "Boss", 1),
		mkSubject("s2", "B", "Boss", 2),
		mkSubject("s3", "C", "Boss", 3),
		mkSubject("s4", "D", "Boss", 4),
		mkSubject("s5", "E", "Boss", 5),
		mkSubject("s6", "F", "Boss", 6),
	);
	const result = CollectionStage.collect(bossQuery, tree);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([
		{ x: "B", y: 2 },
		{ x: "C", y: 3 },
		{ x: "D", y: 4 },
		{ x: "E", y: 5 },
		{ x: "F", y: 6 },
	]);
});

test("reliable-only by default excludes unreliable deaths", () => {
	const tree = treeOf(mkSubject("s1", "Boss", "Boss", 3, 4)); // 3 reliable, 4 unreliable
	const result = CollectionStage.collect(bossQuery, tree);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([{ x: "Boss", y: 3 }]);
});

test("showUnreliable=true counts every death", () => {
	mockGet.mockReturnValue({ showUnreliable: true });
	const tree = treeOf(mkSubject("s1", "Boss", "Boss", 3, 4));
	const result = CollectionStage.collect(bossQuery, tree);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([{ x: "Boss", y: 7 }]);
});

test("non-temporal reliability counts every death regardless of the toggle", () => {
	mockGet.mockReturnValue({}); // toggle off, but isTemporal:false ignores it
	const tree = treeOf(mkSubject("s1", "Boss", "Boss", 3, 4));
	const nonTemporal: Query = {
		...bossQuery,
		reliability: { isTemporal: false },
	};
	const result = CollectionStage.collect(nonTemporal, tree);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([{ x: "Boss", y: 7 }]);
});

test("deathsByProfile ranks the top 5 profiles by deaths, ascending", () => {
	const tree = treeOf(
		mkProfile("p1", ["s1"]),
		mkProfile("p2", ["s2"]),
		mkSubject("s1", "S1", "Boss", 3, 0, "p1"),
		mkSubject("s2", "S2", "Boss", 7, 0, "p2"),
	);
	const query: Query = {
		id: "top-profiles",
		title: "T",
		description: "",
		method: "deathsByProfile",
		chartType: "bar",
		scope: [],
		reliability: { isTemporal: false },
	};
	const result = CollectionStage.collect(query, tree);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([
		{ x: "p1", y: 3 },
		{ x: "p2", y: 7 },
	]);
});

test("unknown method throws", () => {
	expect(() =>
		CollectionStage.collect({ ...bossQuery, method: "nope" }, new Map()),
	).toThrow();
});

test("deathsByDay emits one raw-timestamp point per death (bucketing is deferred to render)", () => {
	const subject = mkSubject("s1", "Boss", "Boss", 0);
	subject.log = [
		{
			id: "d1",
			parentID: "s1",
			timestamp: "2024-01-01T10:00:00.000Z",
			timestampRel: true,
			remark: null,
		},
		{
			id: "d2",
			parentID: "s1",
			timestamp: "2024-01-01T22:00:00.000Z",
			timestampRel: true,
			remark: null,
		},
		{
			id: "d3",
			parentID: "s1",
			timestamp: "2024-01-02T20:00:00.000Z",
			timestampRel: false,
			remark: null,
		},
	];
	const tree = treeOf(subject);
	const calendarQuery: Query = {
		id: "deaths-by-day",
		title: "Deaths by Day",
		description: "",
		method: "deathsByDay",
		chartType: "calendar",
		scope: [],
		reliability: { isTemporal: false },
	};
	const result = CollectionStage.collect(calendarQuery, tree);
	if (result.kind !== "category") throw new Error("expected category");

	expect(result.points).toEqual([
		{ x: "2024-01-01T10:00:00.000Z", y: 1 },
		{ x: "2024-01-01T22:00:00.000Z", y: 1 },
		{ x: "2024-01-02T20:00:00.000Z", y: 1 },
	]);
});

test("deathsByDay excludes unreliable deaths when isTemporal and toggle is off", () => {
	const subject = mkSubject("s1", "Boss", "Boss", 0);
	subject.log = [
		{
			id: "d1",
			parentID: "s1",
			timestamp: "2024-01-01T10:00:00.000Z",
			timestampRel: true,
			remark: null,
		},
		{
			id: "d2",
			parentID: "s1",
			timestamp: "2024-01-01T22:00:00.000Z",
			timestampRel: false,
			remark: null,
		},
	];
	const tree = treeOf(subject);
	const calendarQuery: Query = {
		id: "deaths-by-day",
		title: "Deaths by Day",
		description: "",
		method: "deathsByDay",
		chartType: "calendar",
		scope: [],
		reliability: { isTemporal: true, field: "timestamp" },
	};
	const result = CollectionStage.collect(calendarQuery, tree);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([{ x: "2024-01-01T10:00:00.000Z", y: 1 }]);
});

test("deathsCumulative steps once per death, in chronological order", () => {
	const subject = mkSubject("s1", "Boss", "Boss", 0);
	subject.log = [
		{
			id: "d1",
			parentID: "s1",
			timestamp: "2024-01-01T10:00:00.000Z",
			timestampRel: true,
			remark: null,
		},
		{
			id: "d2",
			parentID: "s1",
			timestamp: "2024-01-01T22:00:00.000Z",
			timestampRel: true,
			remark: null,
		},
		{
			id: "d3",
			parentID: "s1",
			timestamp: "2024-01-02T12:00:00.000Z",
			timestampRel: true,
			remark: null,
		},
		{
			id: "d4",
			parentID: "s1",
			timestamp: "2024-01-03T12:00:00.000Z",
			timestampRel: true,
			remark: null,
		},
		{
			id: "d5",
			parentID: "s1",
			timestamp: "2024-01-03T13:00:00.000Z",
			timestampRel: true,
			remark: null,
		},
		{
			id: "d6",
			parentID: "s1",
			timestamp: "2024-01-03T14:00:00.000Z",
			timestampRel: true,
			remark: null,
		},
	];
	const tree = treeOf(subject);
	const cumulativeQuery: Query = {
		id: "cumulative-deaths-over-time",
		title: "Cumulative Deaths Over Time",
		description: "",
		method: "deathsCumulative",
		chartType: "time-line",
		scope: [],
		reliability: { isTemporal: false },
	};
	const result = CollectionStage.collect(cumulativeQuery, tree);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([
		{ x: "2024-01-01T10:00:00.000Z", y: 1 },
		{ x: "2024-01-01T22:00:00.000Z", y: 2 },
		{ x: "2024-01-02T12:00:00.000Z", y: 3 },
		{ x: "2024-01-03T12:00:00.000Z", y: 4 },
		{ x: "2024-01-03T13:00:00.000Z", y: 5 },
		{ x: "2024-01-03T14:00:00.000Z", y: 6 },
	]);
});

test("deathsCumulative excludes unreliable deaths when isTemporal and toggle is off", () => {
	const subject = mkSubject("s1", "Boss", "Boss", 0);
	subject.log = [
		{
			id: "d1",
			parentID: "s1",
			timestamp: "2024-01-01T10:00:00.000Z",
			timestampRel: true,
			remark: null,
		},
		{
			id: "d2",
			parentID: "s1",
			timestamp: "2024-01-02T10:00:00.000Z",
			timestampRel: false,
			remark: null,
		},
		{
			id: "d3",
			parentID: "s1",
			timestamp: "2024-01-03T10:00:00.000Z",
			timestampRel: true,
			remark: null,
		},
	];
	const tree = treeOf(subject);
	const cumulativeQuery: Query = {
		id: "cumulative-deaths-over-time",
		title: "Cumulative Deaths Over Time",
		description: "",
		method: "deathsCumulative",
		chartType: "time-line",
		scope: [],
		reliability: { isTemporal: true, field: "timestamp" },
	};
	const result = CollectionStage.collect(cumulativeQuery, tree);
	if (result.kind !== "category") throw new Error("expected category");
	expect(result.points).toEqual([
		{ x: "2024-01-01T10:00:00.000Z", y: 1 },
		{ x: "2024-01-03T10:00:00.000Z", y: 2 },
	]);
});

test("graph method builds nodes + edges from the tree", () => {
	const tree = treeOf(
		mkGame("g1", ["p1"]),
		mkProfile("p1", ["s1"]),
		mkSubject("s1", "Boss", "Boss", 2),
	);
	const graphQuery: Query = {
		id: "graph",
		title: "Graph",
		description: "",
		method: "graph",
		chartType: "graph",
		scope: [],
		reliability: { isTemporal: false },
	};
	const result = CollectionStage.collect(graphQuery, tree);
	if (result.kind !== "graph") throw new Error("expected graph");
	expect(result.graph.nodes).toHaveLength(3); // game + profile + subject
	expect(result.graph.edges).toEqual([
		{ id: "g1-p1", source: "g1", target: "p1" },
		{ id: "p1-s1", source: "p1", target: "s1" },
	]);
});

test("deathsBySunburst: games ring under the top-5 cap survives whole; greedy pruning starts at profiles", () => {
	const tree = treeOf(
		mkGame("g1", ["p1"]),
		mkProfile("p1", ["s1", "s2"], "g1"),
		mkSubject("s1", "S1", "Boss", 8, 0, "p1"),
		mkSubject("s2", "S2", "Boss", 7, 0, "p1"),
		mkGame("g2", ["p2"]),
		mkProfile("p2", ["s3"], "g2"),
		mkSubject("s3", "S3", "Boss", 5, 0, "p2"),
	);
	const sunburstQuery: Query = {
		id: "sunburst",
		title: "Sunburst",
		description: "",
		method: "deathsBySunburst",
		chartType: "sunburst",
		scope: [],
		reliability: { isTemporal: false },
	};
	const result = CollectionStage.collect(sunburstQuery, tree);
	if (result.kind !== "sunburst") throw new Error("expected sunburst");
	expect(result.nodes).toEqual([
		{
			name: "g1",
			value: 15,
			children: [
				{
					name: "p1",
					value: 15,
					children: [
						{ name: "S1", value: 8, children: [] },
						{ name: "Other", value: 7, children: [] },
					],
				},
			],
		},
		{
			name: "g2",
			value: 5,
			children: [
				{
					name: "p2",
					value: 5,
					children: [{ name: "S3", value: 5, children: [] }],
				},
			],
		},
	]);
});

test("deathsBySunburst caps the games ring at the top 5 by deaths", () => {
	const values = [10, 20, 30, 40, 50, 60]; // g1..g6
	const tree = treeOf(
		...values.flatMap((deaths, i) => {
			const n = i + 1;
			return [
				mkGame(`g${n}`, [`p${n}`]),
				mkProfile(`p${n}`, [`s${n}`], `g${n}`),
				mkSubject(`s${n}`, `S${n}`, "Boss", deaths, 0, `p${n}`),
			];
		}),
	);
	const sunburstQuery: Query = {
		id: "sunburst",
		title: "Sunburst",
		description: "",
		method: "deathsBySunburst",
		chartType: "sunburst",
		scope: [],
		reliability: { isTemporal: false },
	};
	const result = CollectionStage.collect(sunburstQuery, tree);
	if (result.kind !== "sunburst") throw new Error("expected sunburst");
	// 6 games exist; g1 (10, the smallest) is dropped by the top-5 cap and
	// rolled up into an "Other" slice carrying its value.
	expect(result.nodes.map((n) => n.name)).toEqual([
		"g6",
		"g5",
		"g4",
		"g3",
		"g2",
		"Other",
	]);
	expect(result.nodes.at(-1)).toEqual({
		name: "Other",
		value: 10,
		children: [],
	});
});

test("deathsBySunburst prunes zero-death branches at every level", () => {
	const tree = treeOf(
		mkGame("g1", ["p1"]),
		mkProfile("p1", ["s1", "s2"], "g1"),
		mkSubject("s1", "S1", "Boss", 5, 0, "p1"),
		mkSubject("s2", "S2", "Boss", 0, 0, "p1"), // no deaths - pruned
		mkGame("g2", ["p2"]), // no deaths anywhere in this game - pruned entirely
		mkProfile("p2", ["s3"], "g2"),
		mkSubject("s3", "S3", "Boss", 0, 0, "p2"),
	);
	const sunburstQuery: Query = {
		id: "sunburst",
		title: "Sunburst",
		description: "",
		method: "deathsBySunburst",
		chartType: "sunburst",
		scope: [],
		reliability: { isTemporal: false },
	};
	const result = CollectionStage.collect(sunburstQuery, tree);
	if (result.kind !== "sunburst") throw new Error("expected sunburst");
	expect(result.nodes).toEqual([
		{
			name: "g1",
			value: 5,
			children: [
				{
					name: "p1",
					value: 5,
					children: [{ name: "S1", value: 5, children: [] }],
				},
			],
		},
	]);
});

test("deathsByProfileGroup groups subjects by profile group, reusing the same greedy/Other pruning and zero-death filtering", () => {
	const s1 = mkSubject("s1", "S1", "Boss", 5, 0, "p1");
	const s2 = mkSubject("s2", "S2", "Boss", 3, 0, "p1");
	const s3 = mkSubject("s3", "S3", "Boss", 0, 0, "p1");
	const profile1 = mkProfile("p1", ["s1", "s2", "s3"]);
	profile1.groupings = [
		{
			id: "grp00001",
			title: "Speedrun",
			members: ["s1", "s2", "s3"],
			description: "",
			dateStart: ISO,
			dateEnd: null,
			dateStartRel: true,
			dateEndRel: false,
			completed: false,
		},
	];

	const s4 = mkSubject("s4", "S4", "Boss", 0, 0, "p2");
	const profile2 = mkProfile("p2", ["s4"]);
	profile2.groupings = [
		{
			id: "grp00002",
			title: "Empty Group",
			members: ["s4"],
			description: "",
			dateStart: ISO,
			dateEnd: null,
			dateStartRel: true,
			dateEndRel: false,
			completed: false,
		},
	];

	const tree = treeOf(profile1, profile2, s1, s2, s3, s4);
	const groupQuery: Query = {
		id: "profile-groups",
		title: "Profile Groups",
		description: "",
		method: "deathsByProfileGroup",
		chartType: "sunburst",
		scope: [],
		reliability: { isTemporal: false },
	};
	const result = CollectionStage.collect(groupQuery, tree);
	if (result.kind !== "sunburst") throw new Error("expected sunburst");
	expect(result.nodes).toEqual([
		{
			name: "Speedrun",
			value: 8,
			children: [
				{ name: "S1", value: 5, children: [] },
				{ name: "Other", value: 3, children: [] },
			],
		},
	]);
});
