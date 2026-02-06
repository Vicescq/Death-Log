import { CONSTANTS } from "../../shared/constants";
import type {
	Tree,
	Profile,
	DistinctTreeNode,
	ProfileGroup,
} from "../model/TreeNodeModel";
import { formatString, isNameUniqueTEMP } from "./utils";

export type ValidationResponse = {
	msg: string;
	cause: keyof typeof InputTextValidationStrings;
};

export type ValidationContext =
	| ValidationContextNodeAdd
	| ValidationContextNodeEdit
	| ValidationContextProfileGroupAdd
	| ValidationContextProfileGroupEdit;

type ValidationContextNodeAdd = {
	type: "nodeAdd";
	tree: Tree;
	parentID: string;
};

type ValidationContextNodeEdit = {
	type: "nodeEdit";
	tree: Tree;
	parentID: string;
	originalNode: DistinctTreeNode;
	node: DistinctTreeNode;
};

type ValidationContextProfileGroupAdd = {
	type: "profileGroupAdd";
	profile: Profile;
};

type ValidationContextProfileGroupEdit = {
	type: "profileGroupEdit";
	profile: Profile;
	originalProfileGroup: ProfileGroup;
	profileGroup: ProfileGroup;
};

// type ValidationContextDeathEntryEdit = {
// 	type: "deathEntryEdit";

// }

export const InputTextValidationStrings = {
	ok: "",
	nonuniqueEditDefault: "",
	nonunique: CONSTANTS.INPUT_TEXT_ERROR.NON_UNIQUE,
	emptyAddDefault: "",
	empty: CONSTANTS.INPUT_TEXT_ERROR.EMPTY,
	nonstr: CONSTANTS.INPUT_TEXT_ERROR.STR,
	elp: CONSTANTS.INPUT_TEXT_ERROR.ELP,
} as const;

export function validateStringTEMP(
	inputText: string,
	context: ValidationContext,
): ValidationResponse {
	inputText = formatString(inputText);
	if (typeof inputText != "string") {
		return {
			msg: InputTextValidationStrings.nonstr,
			cause: "nonstr",
		};
	}

	if (
		inputText == "" &&
		(context.type == "nodeAdd" || context.type == "profileGroupAdd")
	) {
		return {
			msg: InputTextValidationStrings.emptyAddDefault,
			cause: "emptyAddDefault",
		};
	}

	if (inputText == "") {
		return {
			msg: InputTextValidationStrings.empty,
			cause: "empty",
		};
	}

	if (inputText.match(/^\.{1,}$/)) {
		return {
			msg: InputTextValidationStrings.elp,
			cause: "elp",
		};
	}

	const uniqueRes = isNameUniqueTEMP(inputText, context);

	if (!uniqueRes) {
		return {
			msg: InputTextValidationStrings.nonunique,
			cause: "nonunique",
		};
	} else if (uniqueRes == "defaultEditedName") {
		return {
			msg: InputTextValidationStrings.nonuniqueEditDefault,
			cause: "nonuniqueEditDefault",
		};
	}

	return {
		msg: InputTextValidationStrings.ok,
		cause: "ok",
	};
}

export type NameUniquenessResponse = true | false | "defaultEditedName";


