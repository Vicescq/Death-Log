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
import { assertIsNonNull, assertIsProfile } from "../utils";
import type {
	ValidationContext,
	NameUniquenessResponse,
} from "./stringValidation";

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
	subjectIDOvr?: string,
): Death {
	return {
		id: subjectIDOvr
			? subjectIDOvr
			: generateAndValidateID({
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

export function validateString(
	inputText: string,
	type: "edit" | "add",
	names: string[],
	currentlyEditingName: string | null,
) {
	inputText = formatString(inputText);
	if (typeof inputText != "string") {
		return "Not a string!";
	}

	if (inputText.match(/^\.{1,}$/)) {
		return "No ellipses allowed!";
	}

	if (inputText == "" && type == "add") {
		return "Cannot be an empty name!";
	}

	for (const name of names) {
		if (name != currentlyEditingName && name == inputText) {
			return "That name already exists!";
		}
	}

	return true;
}

export function isNameUniqueTEMP(
	inputText: string,
	context: ValidationContext,
): NameUniquenessResponse {
	if (context.type == "nodeAdd" || context.type == "nodeEdit") {
		const parent = context.tree.get(context.parentID);
		assertIsNonNull(parent);
		if (
			context.type == "nodeEdit" &&
			context.originalNode.name == inputText
		)
			return "defaultEditedName";
		for (let i = 0; i < parent.childIDS.length; i++) {
			const child: DistinctTreeNode | undefined = context.tree.get(
				parent.childIDS[i],
			); // dont know why TS doesnt auto complete the type and labels it as any?
			assertIsNonNull(child);

			if (child.name == inputText) {
				return false;
			}
		}
	} else {
		const profile = context.profile;
		if (profile) {
			assertIsProfile(profile);
			const groupings = profile.groupings;
			if (
				context.type == "profileGroupEdit" &&
				context.originalProfileGroup.title == inputText
			)
				return "defaultEditedName";
			for (let i = 0; i < groupings.length; i++) {
				if (groupings[i].title == inputText) return false;
			}
		}
	}

	return true;
}
