import type {
	Subject,
	DistinctTreeNode,
	Game,
	Profile,
	RootNode,
	Tree,
	Death,
} from "../model/TreeNodeModel";
import LocalDB from "../services/LocalDB";
import { nanoid } from "nanoid";
import { assertIsNonNull } from "../utils";

export function identifyDeletedSelfAndChildrenIDS(
	node: DistinctTreeNode,
	tree: Tree,
) {
	const idsToBeDeleted: string[] = [];

	function deleteSelfAndChildren(node: DistinctTreeNode) {
		// leaf nodes
		if (node.childIDS.length == 0) {
			idsToBeDeleted.push(node.id);
			return;
		}

		// iterate every child node
		for (let i = 0; i < node.childIDS.length; i++) {
			const childNode = tree.get(node.childIDS[i]);
			assertIsNonNull(childNode);
			deleteSelfAndChildren(childNode);
		}

		idsToBeDeleted.push(node.id);
	}

	deleteSelfAndChildren(node);
	return idsToBeDeleted;
}

export function createRootNode() {
	const rootNode: RootNode = {
		type: "ROOT_NODE",
		id: "ROOT_NODE",
		childIDS: [],
		parentID: "NONE",
		name: "",
		completed: false,
		notes: "",
		dateStart: "",
		dateEnd: "",
		dateStartRel: true,
		dateEndRel: true,
	};
	return rootNode;
}

export function createGame(inputText: string, tree: Tree) {
	const id = generateAndValidateID({ type: "node", tree: tree });
	const defaultGame: Game = {
		type: "game",
		id: id,
		childIDS: [],
		parentID: "ROOT_NODE",
		name: inputText,
		completed: false,
		notes: "",
		dateStart: new Date().toISOString(),
		dateEnd: null,
		dateStartRel: true,
		dateEndRel: true, // maybe should be null?
	};
	return defaultGame;
}

export function createProfile(inputText: string, parentID: string, tree: Tree) {
	const id = generateAndValidateID({ type: "node", tree: tree });
	const defaultProfile: Profile = {
		type: "profile",
		id: id,
		childIDS: [],
		parentID: parentID,
		name: inputText,
		completed: false,
		notes: "",
		dateStart: new Date().toISOString(),
		dateEnd: null,
		groupings: [],
		dateStartRel: true,
		dateEndRel: true,
	};
	return defaultProfile;
}

export function createSubject(inputText: string, parentID: string, tree: Tree) {
	const id = generateAndValidateID({ type: "node", tree: tree });
	const defaultSubject: Subject = {
		type: "subject",
		id: id,
		childIDS: [],
		parentID: parentID,
		name: inputText,
		completed: false,
		notes: "",
		dateStart: new Date().toISOString(),
		dateEnd: null,
		log: [],
		reoccurring: false,
		context: "boss",
		timeSpent: null,
		dateStartRel: true,
		dateEndRel: true,
	};
	return defaultSubject;
}

export function createDeath(
	subject: Subject,
	remark: string | null,
	timestampRel: boolean,
	timestampOvr?: string,
): Death {
	return {
		id: generateAndValidateID({
			type: "death",
			ids: subject.log.map((death) => death.id),
		}),
		parentID: subject.id,
		timestamp: timestampOvr ? timestampOvr : new Date().toISOString(),
		timestampRel: timestampRel,
		remark: remark,
	};
}

export type GenerateIDContext = GenerateDeathID | GenerateNodeID;

type GenerateNodeID = {
	type: "node";
	tree: Tree;
};

type GenerateDeathID = {
	type: "death";
	ids: string[];
};

export function generateAndValidateID(context: GenerateIDContext) {
	let id: string;
	let counter = 0;
	do {
		id = nanoid(8);
		counter += 1;
	} while (
		(context.type == "node"
			? context.tree.has(id)
			: context.ids.includes(id)) &&
		counter <= 100
	);
	if (counter > 100) {
		throw new Error(
			"ERROR! You somehow generated 100 duplicated IDs of length 8 in a row. Either you messed something in the local db or youre an insanely lucky person! :)",
		);
	}
	return id;
}

export async function refreshTree(
	initTree: (nodes: DistinctTreeNode[]) => void,
) {
	const nodes = await LocalDB.getNodes();
	initTree(nodes);
}

export function formatString(str: string) {
	return str.replace(/\s+/g, " ").trim();
}
