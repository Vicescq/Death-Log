import { expect, test, beforeEach, afterEach } from "vitest";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { scopeNodes, scopeDeaths } from "../ScopingStage";
import {
	extractNodeDeaths,
	extractNodeTimeline,
	extractDeathsByDay,
	extractDeathsCumulative,
	extractHierarchy,
	extractNodeScatter,
} from "../ExtractionStage";
import { defaultFilters, defaultDeathFilters } from "../../../../shared/defaults";
import { setupTestTree, cleanupTestTree } from "./fixtures";
import { assertIsNonNull, assertIsSubject } from "../../../utils/asserts";
import type { BarNodeQuery } from "../../../model/stats-query-model/node-query";
import type { HmcDeathQuery } from "../../../model/stats-query-model/death-query";
import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";

const baseNodeQ: Omit<BarNodeQuery, "fetch" | "scope"> = {
	filter: defaultFilters,
	sort: { sortingKey: "name", ascending: true },
	title: "Test",
	echartsConfig: {},
	extract: "nodeDeaths",
	chartType: "bar",
};

const baseDeathQ: Omit<HmcDeathQuery, "scope"> = {
	fetch: "deaths",
	title: "Test",
	filter: defaultDeathFilters,
	sort: { sortingKey: "timestamp", ascending: true },
	echartsConfig: {},
	extract: "deathsByDay",
	chartType: "hmc",
};

let fixture: ReturnType<typeof setupTestTree>;

beforeEach(() => {
	fixture = setupTestTree();
});

afterEach(() => {
	cleanupTestTree();
});

// --- extractNodeDeaths ---

test("extractNodeDeaths | maps each node to its name (x) and death count (y)", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "profile", ids: [fixture.profileID] },
	};
	const nodes = scopeNodes(q, tree);
	const result = extractNodeDeaths(nodes, tree);

	expect(result).toHaveLength(3);
	const names = result.map((p) => p.x);
	expect(names).toContain("Subject 1");
	expect(names).toContain("Subject 2");
	expect(names).toContain("Subject 3");
});

test("extractNodeDeaths | y values sum to total deaths across all subjects", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "profile", ids: [fixture.profileID] },
	};
	const nodes = scopeNodes(q, tree);
	const result = extractNodeDeaths(nodes, tree);

	// fixture: subject1=2, subject2=3, subject3=1
	const total = result.reduce((sum, p) => sum + p.y, 0);
	expect(total).toBe(6);
});

test("extractNodeDeaths | individual death counts match fixture", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "profile", ids: [fixture.profileID] },
	};
	const nodes = scopeNodes(q, tree);
	const result = extractNodeDeaths(nodes, tree);

	const byName = Object.fromEntries(result.map((p) => [p.x, p.y]));
	expect(byName["Subject 1"]).toBe(2);
	expect(byName["Subject 2"]).toBe(3);
	expect(byName["Subject 3"]).toBe(1);
});

// --- extractNodeTimeline ---

test("extractNodeTimeline | dateExtract: 'start' — one point per node with string x", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "profile", ids: [fixture.profileID] },
	};
	const nodes = scopeNodes(q, tree);
	const result = extractNodeTimeline(nodes, "start", tree);

	expect(result).toHaveLength(3);
	expect(result.every((p) => typeof p.x === "string" && p.x.length > 0)).toBe(true);
});

test("extractNodeTimeline | dateExtract: 'start' — y values match death counts", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "profile", ids: [fixture.profileID] },
	};
	const nodes = scopeNodes(q, tree);
	const result = extractNodeTimeline(nodes, "start", tree);

	const total = result.reduce((sum, p) => sum + p.y, 0);
	expect(total).toBe(6);
});

test("extractNodeTimeline | dateExtract: 'end' — x is derived from each node's dateEnd", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "profile", ids: [fixture.profileID] },
	};
	const rawNodes = scopeNodes(q, tree);
	const nodesWithEnd = rawNodes.map(
		(n) => ({ ...n, dateEnd: "2024-06-15T12:00:00.000Z" }),
	) as unknown as DistinctTreeNode[];

	const result = extractNodeTimeline(nodesWithEnd, "end", tree);

	expect(result).toHaveLength(3);
	// isoToDateSTD("2024-06-15T12:00:00.000Z") in Mountain time = "2024-06-15"
	expect(result.every((p) => p.x === "2024-06-15")).toBe(true);
});

// --- extractDeathsByDay ---

test("extractDeathsByDay | total y across all buckets equals total deaths", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: HmcDeathQuery = { ...baseDeathQ, scope: { type: "global" } };
	const deaths = scopeDeaths(q, tree);
	const result = extractDeathsByDay(deaths, tree);

	const total = result.reduce((sum, p) => sum + p.y, 0);
	expect(total).toBe(6);
});

test("extractDeathsByDay | each point has a string x (date) and a meta string", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: HmcDeathQuery = { ...baseDeathQ, scope: { type: "global" } };
	const deaths = scopeDeaths(q, tree);
	const result = extractDeathsByDay(deaths, tree);

	expect(result.length).toBeGreaterThan(0);
	result.forEach((p) => {
		expect(typeof p.x).toBe("string");
		expect(p.meta).toBeDefined();
	});
});

test("extractDeathsByDay | scoped to one subject only counts that subject's deaths", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: HmcDeathQuery = {
		...baseDeathQ,
		scope: { type: "subject", ids: [fixture.subjectIDs[0]] },
	};
	const deaths = scopeDeaths(q, tree);
	const result = extractDeathsByDay(deaths, tree);

	const total = result.reduce((sum, p) => sum + p.y, 0);
	expect(total).toBe(2); // subject1 has 2 deaths
});

// --- extractDeathsCumulative ---

test("extractDeathsCumulative | final y equals total deaths passed in", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: HmcDeathQuery = { ...baseDeathQ, scope: { type: "global" } };
	const deaths = scopeDeaths(q, tree);
	const result = extractDeathsCumulative(deaths);

	expect(result.length).toBeGreaterThan(0);
	expect(result[result.length - 1].y).toBe(6);
});

test("extractDeathsCumulative | y values are non-decreasing (running total)", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: HmcDeathQuery = { ...baseDeathQ, scope: { type: "global" } };
	const deaths = scopeDeaths(q, tree);
	const result = extractDeathsCumulative(deaths);

	for (let i = 1; i < result.length; i++) {
		expect(result[i].y).toBeGreaterThanOrEqual(result[i - 1].y);
	}
});

test("extractDeathsCumulative | empty input returns empty array", () => {
	const result = extractDeathsCumulative([]);
	expect(result).toHaveLength(0);
});

// --- extractHierarchy ---

test("extractHierarchy | root node name and total deaths", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "games",
		scope: { type: "global" },
	};
	const nodes = scopeNodes(q, tree);
	const result = extractHierarchy(nodes, tree, 3, 1.0, 3);

	expect(result).toHaveLength(1);
	expect(result[0].name).toBe("Test Game");
	expect(result[0].value).toBe(6);
});

test("extractHierarchy | maxDepth 1 produces leaf with no children", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "games",
		scope: { type: "global" },
	};
	const nodes = scopeNodes(q, tree);
	const result = extractHierarchy(nodes, tree, 3, 1.0, 1);

	expect(result[0].children).toBeUndefined();
	expect(result[0].value).toBe(6);
});

test("extractHierarchy | maxDepth 2 expands one level (game → profile)", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "games",
		scope: { type: "global" },
	};
	const nodes = scopeNodes(q, tree);
	const result = extractHierarchy(nodes, tree, 3, 1.0, 2);

	expect(result[0].children).toHaveLength(1);
	expect(result[0].children![0].name).toBe("Test Profile");
	expect(result[0].children![0].children).toBeUndefined();
});

test("extractHierarchy | topN limits children selected at each level", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "games",
		scope: { type: "global" },
	};
	const nodes = scopeNodes(q, tree);
	// topN=1 at depth 3: profile expands only its top 1 subject
	const result = extractHierarchy(nodes, tree, 1, 1.0, 3);

	const profileNode = result[0].children![0];
	expect(profileNode.children).toHaveLength(1);
	// Subject 2 has the most deaths (3) — it should be the selected one
	expect(profileNode.children![0].name).toBe("Subject 2");
});

// --- extractNodeScatter ---

test("extractNodeScatter | subjects without timeSpent are excluded", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "profile", ids: [fixture.profileID] },
	};
	const nodes = scopeNodes(q, tree);
	const result = extractNodeScatter(nodes, tree);

	expect(result).toHaveLength(0);
});

test("extractNodeScatter | maps subject with timeSpent to x=deaths, y=minutes", () => {
	const tree = useDeathLogStore.getState().tree;
	const subject1 = tree.get(fixture.subjectIDs[0]);
	assertIsNonNull(subject1);
	assertIsSubject(subject1);
	const updatedTree = new Map(tree);
	updatedTree.set(subject1.id, { ...subject1, timeSpent: "01:30:00" });

	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "profile", ids: [fixture.profileID] },
	};
	const nodes = scopeNodes(q, updatedTree);
	const result = extractNodeScatter(nodes, updatedTree);

	expect(result).toHaveLength(1);
	expect(result[0].name).toBe("Subject 1");
	expect(result[0].x).toBe(2);  // 2 deaths
	expect(result[0].y).toBe(90); // 1h 30m = 90 minutes
});

test("extractNodeScatter | multiple subjects with timeSpent all appear", () => {
	const tree = useDeathLogStore.getState().tree;
	const subject1 = tree.get(fixture.subjectIDs[0]);
	assertIsNonNull(subject1);
	assertIsSubject(subject1);
	const subject2 = tree.get(fixture.subjectIDs[1]);
	assertIsNonNull(subject2);
	assertIsSubject(subject2);
	const updatedTree = new Map(tree);
	updatedTree.set(subject1.id, { ...subject1, timeSpent: "00:30:00" });
	updatedTree.set(subject2.id, { ...subject2, timeSpent: "02:00:00" });

	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "profile", ids: [fixture.profileID] },
	};
	const nodes = scopeNodes(q, updatedTree);
	const result = extractNodeScatter(nodes, updatedTree);

	expect(result).toHaveLength(2);
	const byName = Object.fromEntries(result.map((p) => [p.name, p]));
	expect(byName["Subject 1"].x).toBe(2);
	expect(byName["Subject 1"].y).toBe(30);
	expect(byName["Subject 2"].x).toBe(3);
	expect(byName["Subject 2"].y).toBe(120);
});
