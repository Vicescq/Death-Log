import { CONSTANTS } from "../../shared/constants";
import type { Tree, Profile, DistinctTreeNode } from "../model/TreeNodeModel";
import type { EditableForm } from "../pages/death-log/utils";
import { assertIsNonNull, assertIsProfile } from "../utils";
import { formatString } from "./utils";

export type ValidationResponse = {
	valid: boolean;
	msg?: string;
	cause?: keyof typeof InputTextValidationStrings;
};

export type ValidationContextForm =
	| ValidationContextNodeAdd
	| ValidationContextNodeEdit
	| ValidationContextProfileGroupAdd
	| ValidationContextProfileGroupEdit;

export type ValidationContextUniqueness =
	| ValidationContextUniquenessNode
	| ValidationContextUniquenessProfileGroup;

type ValidationContextNodeAdd = {
	type: "nodeAdd";
	tree: Tree;
	parentID: string;
};

type ValidationContextNodeEdit = {
	type: "nodeEdit";
	tree: Tree;
	parentID: string;
	editableForm: EditableForm;
};

type ValidationContextProfileGroupAdd = {
	type: "profileGroupAdd";
	profile: Profile;
};

type ValidationContextProfileGroupEdit = {
	type: "profileGroupEdit";
	profile: Profile;
	editableForm: EditableForm;
};

export type ValidationContextUniquenessNode = {
	type: "uniquenessNode";
	tree: Tree;
	parentID: string;
};

export type ValidationContextUniquenessProfileGroup = {
	type: "uniquenessProfileGroup";
	profile: Profile;
};

export const InputTextValidationStrings = {
	nonunique: CONSTANTS.INPUT_TEXT_ERROR.NON_UNIQUE,
	empty: CONSTANTS.INPUT_TEXT_ERROR.EMPTY,
	nonstr: CONSTANTS.INPUT_TEXT_ERROR.STR,
	elp: CONSTANTS.INPUT_TEXT_ERROR.ELP,
} as const;

export function validateString(
	inputText: string,
	context:
		| ValidationContextUniquenessNode
		| ValidationContextUniquenessProfileGroup,
): ValidationResponse {
	inputText = formatString(inputText);
	if (typeof inputText != "string") {
		return {
			valid: false,
			msg: InputTextValidationStrings.nonstr,
			cause: "nonstr",
		};
	}

	if (inputText == "") {
		return {
			valid: false,
			msg: InputTextValidationStrings.empty,
			cause: "empty",
		};
	}

	if (inputText.match(/^\.{1,}$/)) {
		return {
			valid: false,
			msg: InputTextValidationStrings.elp,
			cause: "elp",
		};
	}

	if (!isNameUnique(inputText, context)) {
		return {
			valid: false,
			msg: InputTextValidationStrings.nonunique,
			cause: "nonunique",
		};
	}

	return {
		valid: true,
	};
}

export function isNameUnique(
	inputText: string,
	context: ValidationContextUniqueness,
) {
	if (context.type == "uniquenessNode") {
		const parent = context.tree.get(context.parentID);
		if (parent) {
			for (let i = 0; i < parent.childIDS.length; i++) {
				const child: DistinctTreeNode | undefined = context.tree.get(
					parent.childIDS[i],
				); // dont know why TS doesnt auto complete the type and labels it as any?
				assertIsNonNull(child);
				if (child.name == inputText) {
					return false;
				}
			}
		}
	} else if (context.type == "uniquenessProfileGroup") {
		const profile = context.profile;
		if (profile) {
			assertIsProfile(profile);
			const groupings = profile.groupings;
			for (let i = 0; i < groupings.length; i++) {
				if (groupings[i].title == inputText) return false;
			}
		}
	}

	return true;
}
