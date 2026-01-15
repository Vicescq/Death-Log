import type { DistinctTreeNode, Profile, Tree } from "./model/TreeNodeModel";

type ValidationResponse = {
	valid: boolean;
	msg?: string;
	cause?: "nonunique" | "empty" | "nonstr" | "elp";
};

export type StringValidtionContext =
	| StringValidtionContextEdit
	| StringValidtionContextAdd;

type StringValidtionContextEdit = {
	type: "editNode" | "editProfileGroup";
	parentID: string;
	omittedID: string;
};

type StringValidtionContextAdd = {
	type: "addNode" | "addProfileGroup";
	parentID: string;
};

export function assertIsNonNull<T>(value: T): asserts value is NonNullable<T> {
	if (value === undefined || value === null) {
		throw new Error("DEV ERROR! Expected non nullable type is nullable!");
	}
}

export function assertIsProfile(
	value: DistinctTreeNode,
): asserts value is Profile {
	if (value.type != "profile") {
		throw new Error("DEV ERROR! Expected profile type is non profile!");
	}
}

export async function delay(ms: number) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export function validateString(
	inputText: string,
	tree: Tree,
	context: StringValidtionContext,
): ValidationResponse {
	const inputTextValidationStrings = {
		nonunique: "Name has to be unique!",
		empty: "Name cannot be empty!",
		nonstr: "Name has to be of type string!",
		elp: "Please use another name!",
	};
	inputText = inputText.replace(/\s+/g, " ").trim();
	if (typeof inputText != "string") {
		return {
			valid: false,
			msg: inputTextValidationStrings.nonstr,
			cause: "nonstr",
		};
	}

	if (inputText == "") {
		return {
			valid: false,
			msg: inputTextValidationStrings.empty,
			cause: "empty",
		};
	}

	if (inputText == "...") {
		return {
			valid: false,
			msg: inputTextValidationStrings.elp,
			cause: "elp",
		};
	}

	if (!isNameUnique(inputText, tree, context)) {
		return {
			valid: false,
			msg: inputTextValidationStrings.nonunique,
			cause: "nonunique",
		};
	}

	return { valid: true };
}

export function isNameUnique(
	inputText: string,
	tree: Tree,
	context: StringValidtionContext,
) {
	const parent = tree.get(context.parentID);
	if (parent) {
		if (context.type == "editNode") {
			for (let i = 0; i < parent.childIDS.length; i++) {
				if (parent.childIDS[i] == context.omittedID) continue;
				const childID = parent.childIDS[i];
				const child = tree.get(childID);
				assertIsNonNull(child);
				if (child.name == inputText) return false;
			}
		} else if (context.type == "editProfileGroup") {
			assertIsProfile(parent);
			const groupings = parent.groupings;
			for (let i = 0; i < groupings.length; i++) {
				if (parent.childIDS[i] == context.omittedID) continue;
				if (groupings[i].title == inputText) return false;
			}
		} else if (context.type == "addNode") {
			for (let i = 0; i < parent.childIDS.length; i++) {
				const childID = parent.childIDS[i];
				const child = tree.get(childID);
				assertIsNonNull(child);
				if (child.name == inputText) return false;
			}
		} else if (context.type == "addProfileGroup") {
			assertIsProfile(parent);
			const groupings = parent.groupings;
			for (let i = 0; i < groupings.length; i++) {
				if (groupings[i].title == inputText) return false;
			}
		}
	}

	return true;
}
