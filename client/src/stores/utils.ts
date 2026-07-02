import { nanoid } from "nanoid";
import { assertIsNonNull } from "../utils/asserts";
import { type Game } from "../model/tree-node-model/GameSchema";
import type {
	Profile,
	ProfileGroup,
} from "../model/tree-node-model/ProfileSchema";
import type { RootNode } from "../model/tree-node-model/RootNodeSchema";
import type { Subject, Death } from "../model/tree-node-model/SubjectSchema";
import type {
	DistinctTreeNode,
	Tree,
} from "../model/tree-node-model/TreeNodeSchema";
import type { PGFormAdd } from "../model/formSchemas";

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
		parentID: "ROOT_NODE",
		name: "",
		completed: false,
		notes: "",
		dateStart: "",
		dateEnd: "",
		dateStartRel: true,
		dateEndRel: true,
		isFake: false,
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
		isFake: false,
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
		isFake: false,
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
		context: "Boss",
		timeSpent: null,
		dateStartRel: true,
		dateEndRel: true,
		isFake: false,
	};
	return defaultSubject;
}

export function createDeath(
	subject: Subject,
	remark: string | null,
	timestampRel: boolean,
): Death {
	return {
		id: generateAndValidateID({
			type: "generic",
			ids: subject.log.map((death) => death.id),
		}),
		parentID: subject.id,
		timestamp: new Date().toISOString(),
		timestampRel: timestampRel,
		remark: remark,
	};
}

export function createProfileGroup(
	profile: Profile,
	groupInfo: PGFormAdd,
): ProfileGroup {
	return {
		id: generateAndValidateID({
			type: "generic",
			ids: profile.groupings.map((group) => group.id),
		}),
		title: groupInfo.title,
		description: groupInfo.description,
		members: groupInfo.members.map((formMember) => formMember.memberID),
		dateStart: new Date().toISOString(),
		dateStartRel: true,
		dateEnd: null,
		dateEndRel: true,
		completed: false,
	};
}

export type GenerateIDContext = GenerateGenericID | GenerateNodeID;

type GenerateNodeID = {
	type: "node";
	tree: Tree;
};

type GenerateGenericID = {
	type: "generic";
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

