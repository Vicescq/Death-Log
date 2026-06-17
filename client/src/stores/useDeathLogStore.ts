import { create } from "zustand";
import LocalDB from "../services/LocalDB";
import { assertIsNonNull } from "../utils/asserts";
import {
	createRootNode,
	createGame,
	createProfile,
	createSubject,
	identifyDeletedSelfAndChildrenIDS,
} from "./utils";
import type { RootNode } from "../model/tree-node-model/RootNodeSchema";
import { type SubjectCharacteristics } from "../model/tree-node-model/SubjectSchema";
import type {
	Tree,
	DistinctTreeNode,
} from "../model/tree-node-model/TreeNodeSchema";

export type HydrationStatus = "loading" | "ready" | "error";

/**
 * Handler for a failed optimistic write. The in-memory tree was already updated,
 * but the IndexedDB write rejected — so re-hydrate from durable storage to snap
 * the tree back to what actually persisted (drops the phantom add/edit/delete),
 * and log so the failure isn't silent. Defined here (not per-LocalDB-method) so
 * error handling lives at the one layer that can act: the store. Invoked at
 * reject-time, after the store singleton is initialised.
 */
function reconcileOnPersistError(label: string) {
	return (e: unknown) => {
		console.error(`[store] ${label} failed to persist:`, e);
		useDeathLogStore.getState().hydrate(LocalDB.getUserEmail());
	};
}

export type DeathLogState = {
	tree: Tree;
	status: HydrationStatus;
	loadError: Error | null;

	hydrate: (email: string, shouldCancel?: () => boolean) => Promise<void>;
	initTree: (nodes: DistinctTreeNode[]) => void;
	addNode: (
		type: "game" | "profile" | "subject",
		inputText: string,
		parentID: string,
		subjectCharacteristics?: SubjectCharacteristics,
	) => void;
	deleteNode: (node: DistinctTreeNode) => void;
	updateNode: (node: DistinctTreeNode) => void;
};

export const useDeathLogStore = create<DeathLogState>((set, get) => ({
	tree: new Map(),
	status: "loading",
	loadError: null,

	hydrate: async (email, shouldCancel) => {
		LocalDB.setUserEmail(email); // identity + load are one operation
		set({ status: "loading" });
		try {
			const nodes = await LocalDB.getNodes(email);
			if (shouldCancel && shouldCancel()) return; // superseded by a newer run
			get().initTree(nodes);
			set({ status: "ready", loadError: null });
		} catch (e) {
			if (shouldCancel && shouldCancel()) return;
			set({
				status: "error",
				loadError: e instanceof Error ? e : new Error(String(e)),
			});
		}
	},

	initTree: (nodes) => {
		set(() => {
			const rootNode: RootNode = createRootNode();
			const tree: Tree = new Map();
			tree.set("ROOT_NODE", rootNode);
			nodes.forEach((node) => {
				tree.set(node.id, node);
				if (node.type == "game") {
					rootNode.childIDS.push(node.id);
				}
			});

			return { tree };
		});
	},

	addNode: (type, inputText, parentID, subjectCharacteristics) => {
		set((state) => {
			let node: DistinctTreeNode;
			switch (type) {
				case "game":
					node = createGame(inputText, state.tree);
					break;
				case "profile":
					node = createProfile(inputText, parentID, state.tree);
					break;
				case "subject":
					node = createSubject(inputText, parentID, state.tree);
					node = { ...node, ...subjectCharacteristics };
					break;
			}

			const updatedTree = new Map(state.tree);
			updatedTree.set(node.id, node);

			const parentNode = updatedTree.get(parentID);
			assertIsNonNull(parentNode);
			const parentNodeCopy: DistinctTreeNode = {
				...parentNode,
				childIDS: [...parentNode.childIDS, node.id],
			};
			updatedTree.set(parentID, parentNodeCopy);

			const persist =
				parentNodeCopy.id == "ROOT_NODE"
					? LocalDB.addNode(node)
					: LocalDB.addNode(node, parentNodeCopy);
			persist.catch(reconcileOnPersistError("addNode"));
			LocalDB.incrementCRUDCounter();

			return { tree: updatedTree };
		});
	},

	deleteNode: (node) => {
		set((state) => {
			const updatedTree = new Map(state.tree);
			const nodeIDSToBeDeleted = identifyDeletedSelfAndChildrenIDS(
				node,
				updatedTree,
			);
			nodeIDSToBeDeleted.forEach((id) => updatedTree.delete(id));

			const parentNode = updatedTree.get(node.parentID);
			assertIsNonNull(parentNode);
			const parentNodeCopy: DistinctTreeNode = {
				...parentNode,
				childIDS: parentNode.childIDS.filter((id) => id != node.id),
			};
			updatedTree.set(parentNodeCopy.id, parentNodeCopy);

			let persist: Promise<void> = Promise.resolve();
			switch (parentNode.type) {
				case "ROOT_NODE":
					persist = LocalDB.deleteNode(nodeIDSToBeDeleted);
					break;
				case "game":
				case "profile":
					persist = LocalDB.deleteNode(
						nodeIDSToBeDeleted,
						parentNodeCopy,
					);
					break;
			}
			persist.catch(reconcileOnPersistError("deleteNode"));

			LocalDB.incrementCRUDCounter();
			return { tree: updatedTree };
		});
	},

	updateNode: (node) => {
		/**
		 * Updates a node field
		 */
		set((state) => {
			const updatedTree = new Map(state.tree);
			const updatedNode: DistinctTreeNode = { ...node };
			updatedTree.set(updatedNode.id, updatedNode);

			LocalDB.updateNode(updatedNode).catch(
				reconcileOnPersistError("updateNode"),
			);
			LocalDB.incrementCRUDCounter();

			return { tree: updatedTree };
		});
	},
}));
