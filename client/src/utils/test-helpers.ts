import type { UseBoundStore, StoreApi } from "zustand";
import { type DeathLogState } from "../stores/useDeathLogStore";
import { createRootNode } from "../stores/utils";
import { assertIsNonNull } from "./asserts";

export function setUpFullTreeLineage(store: UseBoundStore<StoreApi<DeathLogState>>) {
	store.getState().initTree([createRootNode()]);

	store.getState().addNode("game", "Elden Ring", "ROOT_NODE");
	const gameID = store.getState().tree.get("ROOT_NODE")?.childIDS[0];
	assertIsNonNull(gameID);
	const game = store.getState().tree.get(gameID);
	assertIsNonNull(game);

	store.getState().addNode("profile", "First Playthrough", gameID);
	const profileID = store.getState().tree.get(gameID)?.childIDS[0];
	assertIsNonNull(profileID);
	const profile = store.getState().tree.get(profileID);
	assertIsNonNull(profile);

	store.getState().addNode("subject", "Radahn", profileID);
	const subjectID = store.getState().tree.get(profileID)?.childIDS[0];
	assertIsNonNull(subjectID);

    return {gameID, profileID, subjectID}
}
