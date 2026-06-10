import { expect, test, vi } from "vitest";
import { calcDeaths, filter } from "./utils";
import type { Game } from "../../model/tree-node-model/GameSchema";
import { createDeath, createGame, createRootNode } from "../../stores/utils";
import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../utils/asserts";
import { setUpFullTreeLineage } from "../../utils/test-helpers";
import type { Filters } from "./formSchemas";
import { defaultFilters } from "../../../shared/defaults";

vi.mock("../../services/LocalDB", () => {
	return {
		default: {
			addNode: vi.fn(),
			deleteNode: vi.fn(),
			updateNode: vi.fn(),
			incrementCRUDCounter: vi.fn(),
		},
	};
});

test.beforeEach(() => {
	useDeathLogStore.setState(useDeathLogStore.getInitialState());
});

test("calcDeaths | no deaths", () => {
	const tree: Tree = new Map();
	const root = createRootNode();
	tree.set(root.id, root);
	const game: Game = createGame("Elden Ring", tree);

	expect(calcDeaths(game, tree)).toBe(0);
});

test("calcDeaths | deaths, whole lineage", () => {
	let tree: Tree;

	const ids = setUpFullTreeLineage(useDeathLogStore);
	tree = useDeathLogStore.getState().tree;
	const subject = tree.get(ids.subjectID);
	assertIsNonNull(subject);
	assertIsSubject(subject);

	useDeathLogStore.getState().updateNode({
		...subject,
		log: Array.from({ length: 5 }, () => createDeath(subject, null, true)),
	});

	tree = useDeathLogStore.getState().tree;

	const game = tree.get(ids.gameID);
	assertIsNonNull(game);

	const profile = tree.get(ids.profileID);
	assertIsNonNull(profile);

	const updatedSubject = tree.get(ids.subjectID);
	assertIsNonNull(updatedSubject);

	expect(calcDeaths(game, tree)).toBe(5);
	expect(calcDeaths(profile, tree)).toBe(5);
	expect(calcDeaths(updatedSubject, tree)).toBe(5);
});

test("calcDeaths | deaths, whole lineage, subject siblings with deaths", () => {
	const ids = setUpFullTreeLineage(useDeathLogStore);

	const subject1 = useDeathLogStore.getState().tree.get(ids.subjectID);
	assertIsNonNull(subject1);
	assertIsSubject(subject1);

	useDeathLogStore.getState().updateNode({
		...subject1,
		log: Array.from({ length: 5 }, () => createDeath(subject1, null, true)),
	});

	useDeathLogStore.getState().addNode("subject", "Malenia", ids.profileID);
	const subjectID2 = useDeathLogStore.getState().tree.get(ids.profileID)
		?.childIDS[1];
	assertIsNonNull(subjectID2);

	const subject2 = useDeathLogStore.getState().tree.get(subjectID2);
	assertIsNonNull(subject2);
	assertIsSubject(subject2);

	useDeathLogStore.getState().updateNode({
		...subject2,
		log: Array.from({ length: 5 }, () => createDeath(subject1, null, true)),
	});

	const game = useDeathLogStore.getState().tree.get(ids.gameID);
	assertIsNonNull(game);

	const profile = useDeathLogStore.getState().tree.get(ids.profileID);
	assertIsNonNull(profile);

	const updatedSubject1 = useDeathLogStore.getState().tree.get(ids.subjectID);
	assertIsNonNull(updatedSubject1);

	const updatedSubject2 = useDeathLogStore.getState().tree.get(subjectID2);
	assertIsNonNull(updatedSubject2);

	expect(calcDeaths(game, useDeathLogStore.getState().tree)).toBe(10);
	expect(calcDeaths(profile, useDeathLogStore.getState().tree)).toBe(10);
	expect(calcDeaths(updatedSubject1, useDeathLogStore.getState().tree)).toBe(
		5,
	);
	expect(calcDeaths(updatedSubject2, useDeathLogStore.getState().tree)).toBe(
		5,
	);

	useDeathLogStore.getState().deleteNode(updatedSubject1);

	expect(calcDeaths(game, useDeathLogStore.getState().tree)).toBe(5);
	expect(calcDeaths(profile, useDeathLogStore.getState().tree)).toBe(5);
	expect(calcDeaths(updatedSubject2, useDeathLogStore.getState().tree)).toBe(
		5,
	);
});

test("filter | azRange", () => {
	let filterPrefs: Filters = { ...defaultFilters, azRange: "A-B" };
	const ids = setUpFullTreeLineage(useDeathLogStore);
	const idsToTest = [ids.subjectID];
	const tree = useDeathLogStore.getState().tree;

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(0);

	filterPrefs = { ...defaultFilters };

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(1);
});

test("filter | completed & uncompleted", () => {
	let filterPrefs: Filters = { ...defaultFilters, completed: true };
	const ids = setUpFullTreeLineage(useDeathLogStore);
	const idsToTest = [ids.subjectID];

	const subjectToBeUpdated = useDeathLogStore
		.getState()
		.tree.get(ids.subjectID);
	assertIsNonNull(subjectToBeUpdated);
	useDeathLogStore
		.getState()
		.updateNode({ ...subjectToBeUpdated, completed: true });

	const tree = useDeathLogStore.getState().tree;

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(1);

	filterPrefs = { ...defaultFilters, completed: false };

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(0);
});

test("filter | death range", () => {
	let filterPrefs: Filters = { ...defaultFilters, deathRange: "=1" };
	const ids = setUpFullTreeLineage(useDeathLogStore);

	const subjectToBeUpdated = useDeathLogStore
		.getState()
		.tree.get(ids.subjectID);
	assertIsNonNull(subjectToBeUpdated);
	assertIsSubject(subjectToBeUpdated);
	useDeathLogStore.getState().updateNode({
		...subjectToBeUpdated,
		log: [createDeath(subjectToBeUpdated, null, true)],
	});

	useDeathLogStore.getState().addNode("subject", "Malenia", ids.profileID);

	const tree = useDeathLogStore.getState().tree;

	const subjectID2 = useDeathLogStore.getState().tree.get(ids.profileID)
		?.childIDS[1];
	assertIsNonNull(subjectID2);
	const idsToTest = [ids.subjectID, subjectID2];

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(1);

	filterPrefs = { ...defaultFilters, deathRange: ">=0" };

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(2);
});

test("filter | notes", () => {
	let filterPrefs: Filters = {
		...defaultFilters,
		notes: true,
		noNotes: false,
	};
	const ids = setUpFullTreeLineage(useDeathLogStore);
	const idsToTest = [ids.subjectID];

	const subjectToBeUpdated = useDeathLogStore
		.getState()
		.tree.get(ids.subjectID);
	assertIsNonNull(subjectToBeUpdated);
	useDeathLogStore
		.getState()
		.updateNode({ ...subjectToBeUpdated, notes: "test note" });

	const tree = useDeathLogStore.getState().tree;

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(1);

	filterPrefs = { ...defaultFilters, notes: false, noNotes: true };

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(0);
});

test("filter | reliability flags", () => {
	let filterPrefs: Filters = {
		...defaultFilters,
		reliableStart: true,
		unreliableStart: false,
		reliableEnd: false,
		unreliableEnd: false,
	};
	const ids = setUpFullTreeLineage(useDeathLogStore);
	const idsToTest = [ids.subjectID];

	const tree = useDeathLogStore.getState().tree;

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(1);

	filterPrefs = {
		...defaultFilters,
		reliableStart: false,
		unreliableStart: true,
		reliableEnd: false,
		unreliableEnd: false,
	};

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(0);
});

test("filter | timeSpent", () => {
	let filterPrefs: Filters = {
		...defaultFilters,
		timeSpent: true,
		noTimeSpent: false,
	};
	const ids = setUpFullTreeLineage(useDeathLogStore);
	const idsToTest = [ids.subjectID];

	const tree = useDeathLogStore.getState().tree;

	// Subject has no timeSpent by default
	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(0);

	const subjectToBeUpdated = useDeathLogStore
		.getState()
		.tree.get(ids.subjectID);
	assertIsNonNull(subjectToBeUpdated);
	assertIsSubject(subjectToBeUpdated);
	useDeathLogStore.getState().updateNode({
		...subjectToBeUpdated,
		timeSpent: "01:30:00",
	});

	const updatedTree = useDeathLogStore.getState().tree;

	expect(filter(idsToTest, filterPrefs, updatedTree, "")).toHaveLength(1);

	filterPrefs = { ...defaultFilters, timeSpent: false, noTimeSpent: true };

	expect(filter(idsToTest, filterPrefs, updatedTree, "")).toHaveLength(0);
});

test("filter | subject context - boss", () => {
	let filterPrefs: Filters = {
		...defaultFilters,
		boss: true,
		location: false,
		other: false,
		genericEnemy: false,
		miniBoss: false,
	};
	const ids = setUpFullTreeLineage(useDeathLogStore);
	const idsToTest = [ids.subjectID];

	const subjectToBeUpdated = useDeathLogStore
		.getState()
		.tree.get(ids.subjectID);
	assertIsNonNull(subjectToBeUpdated);
	assertIsSubject(subjectToBeUpdated);
	useDeathLogStore.getState().updateNode({
		...subjectToBeUpdated,
		context: "Boss",
	});

	const tree = useDeathLogStore.getState().tree;

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(1);

	filterPrefs = {
		...defaultFilters,
		boss: false,
		location: false,
		other: false,
		genericEnemy: false,
		miniBoss: false,
	};

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(0);
});

test("filter | subject context - location", () => {
	let filterPrefs: Filters = {
		...defaultFilters,
		boss: false,
		location: true,
		other: false,
		genericEnemy: false,
		miniBoss: false,
	};
	const ids = setUpFullTreeLineage(useDeathLogStore);
	const idsToTest = [ids.subjectID];

	const subjectToBeUpdated = useDeathLogStore
		.getState()
		.tree.get(ids.subjectID);
	assertIsNonNull(subjectToBeUpdated);
	assertIsSubject(subjectToBeUpdated);
	useDeathLogStore.getState().updateNode({
		...subjectToBeUpdated,
		context: "Location",
	});

	const tree = useDeathLogStore.getState().tree;

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(1);
});

test("filter | subject context - multiple enabled filters (OR logic)", () => {
	let filterPrefs: Filters = {
		...defaultFilters,
		boss: true,
		location: true,
		other: false,
		genericEnemy: false,
		miniBoss: false,
	};
	const ids = setUpFullTreeLineage(useDeathLogStore);

	const subject1 = useDeathLogStore.getState().tree.get(ids.subjectID);
	assertIsNonNull(subject1);
	assertIsSubject(subject1);
	useDeathLogStore.getState().updateNode({
		...subject1,
		context: "Boss",
	});

	useDeathLogStore
		.getState()
		.addNode("subject", "TestLocation", ids.profileID);
	const subjectID2 = useDeathLogStore.getState().tree.get(ids.profileID)
		?.childIDS[1];
	assertIsNonNull(subjectID2);

	const subject2 = useDeathLogStore.getState().tree.get(subjectID2);
	assertIsNonNull(subject2);
	assertIsSubject(subject2);
	useDeathLogStore.getState().updateNode({
		...subject2,
		context: "Location",
	});

	const tree = useDeathLogStore.getState().tree;
	const idsToTest = [ids.subjectID, subjectID2];

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(2);

	filterPrefs = {
		...defaultFilters,
		boss: false,
		location: false,
		other: false,
		genericEnemy: false,
		miniBoss: false,
	};

	expect(filter(idsToTest, filterPrefs, tree, "")).toHaveLength(0);
});

test("filter | search query", () => {
	const filterPrefs: Filters = defaultFilters;
	const ids = setUpFullTreeLineage(useDeathLogStore);
	const idsToTest = [ids.subjectID];

	const tree = useDeathLogStore.getState().tree;
	const subject = tree.get(ids.subjectID);
	assertIsNonNull(subject);

	const subjectName = subject.name;

	expect(
		filter(idsToTest, filterPrefs, tree, subjectName.slice(0, 2)),
	).toHaveLength(1);

	expect(
		filter(idsToTest, filterPrefs, tree, subjectName.toUpperCase()),
	).toHaveLength(1);

	expect(filter(idsToTest, filterPrefs, tree, "cxzcxzcxczx")).toHaveLength(0);
});
