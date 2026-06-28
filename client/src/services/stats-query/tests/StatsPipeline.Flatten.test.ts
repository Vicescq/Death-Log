import { expect, test } from "vitest";
import type {
	Tree,
	DistinctTreeNode,
} from "../../../model/tree-node-model/TreeNodeSchema";
import { StatsPipeline } from "../StatsPipeline";

function node(fields: Record<string, unknown>): DistinctTreeNode {
	return fields as unknown as DistinctTreeNode;
}

function makeTree() {
	const tree = new Map() as Tree;

	tree.set(
		"g1",
		node({
			id: "g1",
			type: "game",
			name: "Elden Ring",
			parentID: "ROOT_NODE",
			childIDS: ["p1"],
		}),
	);
	tree.set(
		"p1",
		node({
			id: "p1",
			type: "profile",
			name: "First Run",
			parentID: "g1",
			childIDS: ["s1"],
		}),
	);
	tree.set(
		"s1",
		node({
			id: "s1",
			type: "subject",
			name: "Malenia",
			context: "Boss",
			parentID: "p1",
			dateStart: "2024-01-15T18:00:00.000Z",
			dateStartRel: true,
			dateEnd: "2024-06-01T18:00:00.000Z",
			dateEndRel: false,
			timeSpent: "01:30:00",
			completed: true,
			reoccurring: false,
			childIDS: [],
			log: [
				{
					id: "d1",
					timestamp: "2024-03-15T18:00:00.000Z",
					timestampRel: true,
					remark: "missed dodge",
				},
				{
					id: "d2",
					timestamp: "2024-04-01T18:00:00.000Z",
					timestampRel: false,
					remark: null,
				},
			],
		}),
	);

	return tree;
}

test("empty tree → empty tables", () => {
	const tables = StatsPipeline.Flatten(new Map() as Tree);
	expect(tables.deaths).toHaveLength(0);
	expect(tables.subjects).toHaveLength(0);
});

test("tree with no subject nodes → empty tables", () => {
	const tree = new Map() as Tree;
	tree.set(
		"g1",
		node({
			id: "g1",
			type: "game",
			name: "Game",
			parentID: "ROOT_NODE",
			childIDS: [],
		}),
	);
	const tables = StatsPipeline.Flatten(tree);
	expect(tables.deaths).toHaveLength(0);
	expect(tables.subjects).toHaveLength(0);
});

test("subjects are flattened with correct ancestor fields", () => {
	const tables = StatsPipeline.Flatten(makeTree());
	expect(tables.subjects).toHaveLength(1);
	const row = tables.subjects[0];
	expect(row.id).toBe("s1");
	expect(row.name).toBe("Malenia");
	expect(row.context).toBe("Boss");
	expect(row.profileID).toBe("p1");
	expect(row.profileName).toBe("First Run");
	expect(row.gameID).toBe("g1");
	expect(row.gameName).toBe("Elden Ring");
});

test("subject reliability flags are baked in", () => {
	const tables = StatsPipeline.Flatten(makeTree());
	const row = tables.subjects[0];
	expect(row.dateStartRel).toBe(true);
	expect(row.dateEndRel).toBe(false);
});

test("subject dateEndLocal is null when dateEnd is null", () => {
	const tree = new Map() as Tree;
	tree.set(
		"g1",
		node({
			id: "g1",
			type: "game",
			name: "G",
			parentID: "ROOT_NODE",
			childIDS: ["p1"],
		}),
	);
	tree.set(
		"p1",
		node({
			id: "p1",
			type: "profile",
			name: "P",
			parentID: "g1",
			childIDS: ["s1"],
		}),
	);
	tree.set(
		"s1",
		node({
			id: "s1",
			type: "subject",
			name: "Boss",
			context: "Boss",
			parentID: "p1",
			dateStart: "2024-01-15T18:00:00.000Z",
			dateStartRel: true,
			dateEnd: null,
			dateEndRel: false,
			timeSpent: null,
			completed: false,
			reoccurring: false,
			childIDS: [],
			log: [],
		}),
	);
	const tables = StatsPipeline.Flatten(tree);
	expect(tables.subjects[0].dateEndLocal).toBeNull();
});

test("deaths count matches log length", () => {
	const tables = StatsPipeline.Flatten(makeTree());
	expect(tables.subjects[0].deaths).toBe(2);
});

test("deaths are flattened with ancestor fields", () => {
	const tables = StatsPipeline.Flatten(makeTree());
	expect(tables.deaths).toHaveLength(2);

	const d1 = tables.deaths.find((d) => d.id === "d1");
	expect(d1).toBeDefined();
	expect(d1!.timestampRel).toBe(true);
	expect(d1!.remark).toBe("missed dodge");
	expect(d1!.subjectID).toBe("s1");
	expect(d1!.subjectName).toBe("Malenia");
	expect(d1!.subjectContext).toBe("Boss");
	expect(d1!.profileID).toBe("p1");
	expect(d1!.profileName).toBe("First Run");
	expect(d1!.gameID).toBe("g1");
	expect(d1!.gameName).toBe("Elden Ring");

	const d2 = tables.deaths.find((d) => d.id === "d2");
	expect(d2!.timestampRel).toBe(false);
	expect(d2!.remark).toBeNull();
});

test("death timestampLocal uses local time (not UTC)", () => {
	const tables = StatsPipeline.Flatten(makeTree());
	const d1 = tables.deaths.find((d) => d.id === "d1")!;
	// "2024-03-15T18:00:00.000Z" → local date is still 2024-03-15 in Edmonton
	expect(d1.timestampLocal).toMatch(/^2024-03-15/);
	// format is ISO-like: YYYY-MM-DDTHH:mm:ss
	expect(d1.timestampLocal).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
});

test("timeSpentMins - HH:MM:SS string is converted correctly", () => {
	const tables = StatsPipeline.Flatten(makeTree());
	// "01:30:00" = 1*60 + 30 + 0/60 = 90 mins
	expect(tables.subjects[0].timeSpentMins).toBe(90);
});

test("timeSpentMins - null timeSpent becomes 0", () => {
	const tree = new Map() as Tree;
	tree.set(
		"g1",
		node({
			id: "g1",
			type: "game",
			name: "G",
			parentID: "ROOT_NODE",
			childIDS: ["p1"],
		}),
	);
	tree.set(
		"p1",
		node({
			id: "p1",
			type: "profile",
			name: "P",
			parentID: "g1",
			childIDS: ["s1"],
		}),
	);
	tree.set(
		"s1",
		node({
			id: "s1",
			type: "subject",
			name: "Boss",
			context: "Boss",
			parentID: "p1",
			dateStart: "2024-01-15T18:00:00.000Z",
			dateStartRel: true,
			dateEnd: null,
			dateEndRel: false,
			timeSpent: null,
			completed: false,
			reoccurring: false,
			childIDS: [],
			log: [],
		}),
	);
	const tables = StatsPipeline.Flatten(tree);
	expect(tables.subjects[0].timeSpentMins).toBe(0);
});

test("multiple subjects in same profile are all flattened", () => {
	const tree = new Map() as Tree;
	tree.set(
		"g1",
		node({
			id: "g1",
			type: "game",
			name: "Game",
			parentID: "ROOT_NODE",
			childIDS: ["p1"],
		}),
	);
	tree.set(
		"p1",
		node({
			id: "p1",
			type: "profile",
			name: "P",
			parentID: "g1",
			childIDS: ["s1", "s2"],
		}),
	);
	tree.set(
		"s1",
		node({
			id: "s1",
			type: "subject",
			name: "Boss A",
			context: "Boss",
			parentID: "p1",
			dateStart: "2024-01-15T18:00:00.000Z",
			dateStartRel: true,
			dateEnd: null,
			dateEndRel: false,
			timeSpent: null,
			completed: false,
			reoccurring: false,
			childIDS: [],
			log: [
				{
					id: "d1",
					timestamp: "2024-03-15T18:00:00.000Z",
					timestampRel: true,
					remark: null,
				},
			],
		}),
	);
	tree.set(
		"s2",
		node({
			id: "s2",
			type: "subject",
			name: "Boss B",
			context: "Boss",
			parentID: "p1",
			dateStart: "2024-01-15T18:00:00.000Z",
			dateStartRel: true,
			dateEnd: null,
			dateEndRel: false,
			timeSpent: null,
			completed: false,
			reoccurring: false,
			childIDS: [],
			log: [
				{
					id: "d2",
					timestamp: "2024-03-16T18:00:00.000Z",
					timestampRel: true,
					remark: null,
				},
				{
					id: "d3",
					timestamp: "2024-03-17T18:00:00.000Z",
					timestampRel: false,
					remark: null,
				},
			],
		}),
	);
	const tables = StatsPipeline.Flatten(tree);
	expect(tables.subjects).toHaveLength(2);
	expect(tables.deaths).toHaveLength(3);
	expect(tables.subjects.find((s) => s.name === "Boss A")?.deaths).toBe(1);
	expect(tables.subjects.find((s) => s.name === "Boss B")?.deaths).toBe(2);
});
