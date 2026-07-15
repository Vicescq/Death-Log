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
import { DEFAULT_CRUD_STATE, type CrudState } from "../model/CrudStateSchema";

export type HydrationStatus = "loading" | "ready" | "error";

export type DeathLogState = {
	tree: Tree;
	status: HydrationStatus;
	loadError: Error | null;
	crudState: CrudState;

	refreshTree: () => Promise<void>;
	initTree: (nodes: DistinctTreeNode[]) => void;
	addNode: (
		type: "game" | "profile" | "subject",
		inputText: string,
		parentID: string,
		subjectCharacteristics?: SubjectCharacteristics,
	) => void;
	deleteNode: (node: DistinctTreeNode) => void;
	updateNode: (node: DistinctTreeNode) => void;
	dismissCRUDBanner: () => void;
	resetCRUDCount: () => void;
	setAutoBackup: (autoBackup: boolean) => void;
	setContributeStats: (contributeStats: boolean) => void;
};

export const useDeathLogStore = create<DeathLogState>((set, get) => ({
	tree: new Map(),
	status: "loading",
	loadError: null,
	crudState: DEFAULT_CRUD_STATE,

	refreshTree: async () => {
		set({ status: "loading" });
		try {
			const nodes = await LocalDB.getNodes();
			get().initTree(nodes);
			set({
				status: "ready",
				loadError: null,
				crudState: LocalDB.getCrudState(),
			});
		} catch (e) {
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
		if (get().status !== "ready") return;
		set((state) => {
			const parentNode = state.tree.get(parentID);
			if (parentNode == null) return state;

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

			if (parentNode.isFake) {
				node = { ...node, isFake: true };
			}

			const updatedTree = new Map(state.tree);
			updatedTree.set(node.id, node);

			const parentNodeCopy: DistinctTreeNode = {
				...parentNode,
				childIDS: [...parentNode.childIDS, node.id],
			};
			updatedTree.set(parentID, parentNodeCopy);

			if (parentNodeCopy.id == "ROOT_NODE") {
				LocalDB.addNode(node);
			} else {
				LocalDB.addNode(node, parentNodeCopy);
			}
			LocalDB.incrementCRUDCounter();

			return {
				tree: updatedTree,
				crudState: {
					...state.crudState,
					count: state.crudState.count + 1,
				},
			};
		});
	},

	deleteNode: (node) => {
		if (get().status !== "ready") return;
		set((state) => {
			// already deleted by another tab
			if (!state.tree.has(node.id)) return state;

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

			switch (parentNode.type) {
				case "ROOT_NODE":
					LocalDB.deleteNode(nodeIDSToBeDeleted);
					break;
				case "game":
				case "profile":
					LocalDB.deleteNode(nodeIDSToBeDeleted, parentNodeCopy);
					break;
			}

			LocalDB.incrementCRUDCounter();
			return {
				tree: updatedTree,
				crudState: {
					...state.crudState,
					count: state.crudState.count + 1,
				},
			};
		});
	},

	updateNode: (node) => {
		if (get().status !== "ready") return;
		set((state) => {
			if (!state.tree.has(node.id)) return state;

			const updatedTree = new Map(state.tree);
			const updatedNode: DistinctTreeNode = { ...node };
			updatedTree.set(updatedNode.id, updatedNode);

			LocalDB.updateNode(updatedNode);
			LocalDB.incrementCRUDCounter();

			return {
				tree: updatedTree,
				crudState: {
					...state.crudState,
					count: state.crudState.count + 1,
				},
			};
		});
	},

	dismissCRUDBanner: () => {
		LocalDB.resetCRUDCounter();
		set((state) => ({ crudState: { ...state.crudState, count: 0 } }));
	},

	resetCRUDCount: () => {
		const lastBackup = Date.now();
		LocalDB.resetCrudState(lastBackup);
		set((state) => ({
			crudState: { ...state.crudState, count: 0, lastBackup },
		}));
	},

	setAutoBackup: (autoBackup) => {
		LocalDB.setAutoBackup(autoBackup);
		set((state) => ({ crudState: { ...state.crudState, autoBackup } }));
	},

	setContributeStats: (contributeStats) => {
		LocalDB.setContributeStats(contributeStats);
		set((state) => ({
			crudState: { ...state.crudState, contributeStats },
		}));
	},
}));
