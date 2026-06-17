import { expect, test } from "vitest";
import {
	createGame,
	createProfile,
	createSubject,
	generateAndValidateID,
	identifyDeletedSelfAndChildrenIDS,
} from "../utils";
import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type { Game } from "../../model/tree-node-model/GameSchema";
import type { Profile } from "../../model/tree-node-model/ProfileSchema";
import type { Subject } from "../../model/tree-node-model/SubjectSchema";
import { assertIsNonNull } from "../../utils/asserts";

const tree: Tree = new Map();
const game: Game = createGame("Elden Ring", tree);
tree.set(game.id, game);

const profile: Profile = createProfile("First Playthrough", game.id, tree);
game.childIDS.push(profile.id);
tree.set(profile.id, profile);

const subject: Subject = createSubject("Radahn", profile.id, tree);
profile.childIDS.push(subject.id);
tree.set(subject.id, subject);

test("identifyDeletedSelfAndChildrenIDS | delete game that has full lineage", () => {
	const treeCopy: Tree = structuredClone(tree);
	const node = treeCopy.get(game.id);
	assertIsNonNull(node);
	expect(identifyDeletedSelfAndChildrenIDS(node, treeCopy)).toStrictEqual([
		subject.id,
		profile.id,
		game.id,
	]);
});

test("identifyDeletedSelfAndChildrenIDS | delete profile that has full lineage", () => {
	const treeCopy: Tree = structuredClone(tree);
	const node = treeCopy.get(profile.id);
	assertIsNonNull(node);
	expect(identifyDeletedSelfAndChildrenIDS(node, treeCopy)).toStrictEqual([
		subject.id,
		profile.id,
	]);
});

test("identifyDeletedSelfAndChildrenIDS | delete subject", () => {
	const treeCopy: Tree = structuredClone(tree);
	const node = treeCopy.get(subject.id);
	assertIsNonNull(node);
	expect(identifyDeletedSelfAndChildrenIDS(node, treeCopy)).toStrictEqual([
		subject.id,
	]);
});

test("generateAndValidateID | happy path", async () => {
	expect([subject.id, profile.id, game.id]).not.toContain(
		generateAndValidateID({
			tree: tree,
			type: "node",
		}),
	);
});
