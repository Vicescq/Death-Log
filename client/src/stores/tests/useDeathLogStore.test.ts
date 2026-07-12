import { expect, test, vi } from "vitest";
import { useDeathLogStore } from "../useDeathLogStore";
import { createGame, createRootNode } from "../utils";
import LocalDB from "../../services/LocalDB";
import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import { assertIsNonNull } from "../../utils/asserts";

vi.mock("../../services/LocalDB", () => {
	return {
		default: {
			// write methods return a promise the store attaches .catch to
			addNode: vi.fn().mockResolvedValue(undefined),
			deleteNode: vi.fn().mockResolvedValue(undefined),
			updateNode: vi.fn().mockResolvedValue(undefined),
			incrementCRUDCounter: vi.fn(),
			getCrudState: vi.fn(() => ({
				count: 0,
				lastBackup: 0,
				autoBackup: false,
			})),
			resetCRUDCounter: vi.fn(),
			resetCrudState: vi.fn(),
			setAutoBackup: vi.fn(),
		},
	};
});

// reset state
test.beforeEach(() => {
	useDeathLogStore.setState(useDeathLogStore.getInitialState());
});

test("initTree | clean slate", () => {
	expect(useDeathLogStore.getState().tree).toHaveLength(0);
	useDeathLogStore.getState().initTree([createRootNode()]);
	expect(useDeathLogStore.getState().tree).toHaveLength(1);
	expect(
		useDeathLogStore.getState().tree.get("ROOT_NODE"),
	).not.toBeUndefined();
	expect(useDeathLogStore.getState().tree.get("ROOT_NODE")?.id).toBe(
		"ROOT_NODE",
	);
	expect(useDeathLogStore.getState().tree.get("ROOT_NODE")?.type).toBe(
		"ROOT_NODE",
	);
});

test("initTree | inject existing nodes", () => {
	expect(useDeathLogStore.getState().tree).toHaveLength(0);
	const tree: Tree = useDeathLogStore.getState().tree;
	useDeathLogStore
		.getState()
		.initTree([createRootNode(), createGame("Elden Ring", tree)]);
	expect(useDeathLogStore.getState().tree).toHaveLength(2);
});

test.describe("Tests that need node inits", () => {
	test.beforeEach(() => {
		useDeathLogStore.getState().initTree([createRootNode()]);
		vi.clearAllMocks();
	});

	test("addNode | add a game", () => {
		useDeathLogStore.getState().addNode("game", "abc", "ROOT_NODE");
		expect(useDeathLogStore.getState().tree).toHaveLength(2);
		expect(LocalDB.addNode).toHaveBeenCalledOnce();
	});

	test("addNode | add full lineage", () => {
		useDeathLogStore.getState().addNode("game", "abc", "ROOT_NODE");
		expect(useDeathLogStore.getState().tree).toHaveLength(2);
		expect(LocalDB.addNode).toHaveBeenCalledOnce();

		const gameID = useDeathLogStore.getState().tree.get("ROOT_NODE")
			?.childIDS[0];
		assertIsNonNull(gameID);

		useDeathLogStore
			.getState()
			.addNode("profile", "First Playthrough", gameID);

		const profileID = useDeathLogStore.getState().tree.get(gameID)
			?.childIDS[0];
		assertIsNonNull(profileID);

		expect(useDeathLogStore.getState().tree).toHaveLength(3);
		expect(LocalDB.addNode).toHaveBeenCalledTimes(2);
		expect(
			useDeathLogStore.getState().tree.get(gameID)?.childIDS,
		).toHaveLength(1);

		useDeathLogStore.getState().addNode("subject", "Radahn", profileID);

		expect(useDeathLogStore.getState().tree).toHaveLength(4);
		expect(LocalDB.addNode).toHaveBeenCalledTimes(3);
		expect(
			useDeathLogStore.getState().tree.get(profileID)?.childIDS,
		).toHaveLength(1);
	});

	test("deleteNode | delete game", () => {
		expect(useDeathLogStore.getState().tree).toHaveLength(1);
		useDeathLogStore.getState().addNode("game", "abc", "ROOT_NODE");

		const gameID = useDeathLogStore.getState().tree.get("ROOT_NODE")
			?.childIDS[0];
		assertIsNonNull(gameID);
		const game = useDeathLogStore.getState().tree.get(gameID);
		assertIsNonNull(game);

		useDeathLogStore.getState().deleteNode(game);
		expect(useDeathLogStore.getState().tree).toHaveLength(1);
		expect(
			useDeathLogStore.getState().tree.get("ROOT_NODE")?.childIDS,
		).toHaveLength(0);
		expect(LocalDB.deleteNode).toHaveBeenCalledOnce();
	});

	test("deleteNode | delete lineage", () => {
		useDeathLogStore.getState().addNode("game", "abc", "ROOT_NODE");

		const gameID = useDeathLogStore.getState().tree.get("ROOT_NODE")
			?.childIDS[0];
		assertIsNonNull(gameID);

		useDeathLogStore
			.getState()
			.addNode("profile", "First Playthrough", gameID);

		const profileID = useDeathLogStore.getState().tree.get(gameID)
			?.childIDS[0];
		assertIsNonNull(profileID);

		useDeathLogStore.getState().addNode("subject", "Radahn", profileID);

		expect(useDeathLogStore.getState().tree).toHaveLength(4);

		const game = useDeathLogStore.getState().tree.get(gameID);
		assertIsNonNull(game);
		useDeathLogStore.getState().deleteNode(game);

		expect(useDeathLogStore.getState().tree).toHaveLength(1);
		expect(LocalDB.deleteNode).toHaveBeenCalledOnce();
	});

	test("deleteNode | delete profile with full lineage", () => {
		useDeathLogStore.getState().addNode("game", "abc", "ROOT_NODE");

		const gameID = useDeathLogStore.getState().tree.get("ROOT_NODE")
			?.childIDS[0];
		assertIsNonNull(gameID);

		useDeathLogStore
			.getState()
			.addNode("profile", "First Playthrough", gameID);

		const profileID = useDeathLogStore.getState().tree.get(gameID)
			?.childIDS[0];
		assertIsNonNull(profileID);

		useDeathLogStore.getState().addNode("subject", "Radahn", profileID);

		expect(useDeathLogStore.getState().tree).toHaveLength(4);
		expect(
			useDeathLogStore.getState().tree.get(gameID)?.childIDS,
		).toHaveLength(1);

		const profile = useDeathLogStore.getState().tree.get(profileID);
		assertIsNonNull(profile);
		useDeathLogStore.getState().deleteNode(profile);

		expect(useDeathLogStore.getState().tree).toHaveLength(2);
		expect(LocalDB.deleteNode).toHaveBeenCalledOnce();
		expect(
			useDeathLogStore.getState().tree.get(gameID)?.childIDS,
		).toHaveLength(0);
	});

	test("deleteNode | delete subject with full lineage", () => {
		useDeathLogStore.getState().addNode("game", "abc", "ROOT_NODE");

		const gameID = useDeathLogStore.getState().tree.get("ROOT_NODE")
			?.childIDS[0];
		assertIsNonNull(gameID);

		useDeathLogStore
			.getState()
			.addNode("profile", "First Playthrough", gameID);

		const profileID = useDeathLogStore.getState().tree.get(gameID)
			?.childIDS[0];
		assertIsNonNull(profileID);

		useDeathLogStore.getState().addNode("subject", "Radahn", profileID);

		expect(useDeathLogStore.getState().tree).toHaveLength(4);

		const subjectID = useDeathLogStore.getState().tree.get(profileID)
			?.childIDS[0];
		assertIsNonNull(subjectID);

		const subject = useDeathLogStore.getState().tree.get(subjectID);
		assertIsNonNull(subject);
		useDeathLogStore.getState().deleteNode(subject);

		expect(useDeathLogStore.getState().tree).toHaveLength(3);
		expect(LocalDB.deleteNode).toHaveBeenCalledOnce();
	});

	test("updateNode | update game", () => {
		useDeathLogStore.getState().addNode("game", "abc", "ROOT_NODE");
		const gameID = useDeathLogStore.getState().tree.get("ROOT_NODE")
			?.childIDS[0];
		assertIsNonNull(gameID);
		const game = useDeathLogStore.getState().tree.get(gameID);
		assertIsNonNull(game);

		expect(useDeathLogStore.getState().tree.get(gameID)?.name).toBe("abc");
		useDeathLogStore.getState().updateNode({ ...game, name: "Silksong" });
		expect(useDeathLogStore.getState().tree.get(gameID)?.name).toBe(
			"Silksong",
		);

		expect(LocalDB.updateNode).toHaveBeenCalled();
	});
});
