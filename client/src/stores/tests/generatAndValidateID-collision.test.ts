import { expect, test, vi } from "vitest";
import { createGame, generateAndValidateID } from "../utils";
import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type { Game } from "../../model/tree-node-model/GameSchema";

vi.mock("nanoid", () => ({ nanoid: vi.fn(() => "test-id") }));
const tree: Tree = new Map();
const game: Game = createGame("Elden Ring", tree);
tree.set(game.id, game);

test("generateAndValidateID | throws an error", async () => {
	expect(() => {
		generateAndValidateID({
			tree: tree,
			type: "node",
		});
	}).toThrow();
});
