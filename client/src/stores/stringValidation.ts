import { CONSTANTS } from "../../shared/constants";
import type {
	Tree,
	Profile,
	DistinctTreeNode,
	ProfileGroup,
} from "../model/TreeNodeModel";
import { assertIsNonNull, assertIsProfile } from "../utils";
import { formatString } from "./utils";

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

export const InputTextValidationStrings = {
	ok: "",
	nonuniqueEditDefault: "",
	nonunique: CONSTANTS.INPUT_TEXT_ERROR.NON_UNIQUE,
	emptyAddDefault: "",
	empty: CONSTANTS.INPUT_TEXT_ERROR.EMPTY,
	nonstr: CONSTANTS.INPUT_TEXT_ERROR.STR,
	elp: CONSTANTS.INPUT_TEXT_ERROR.ELP,
} as const;

export function validateString(
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

	const uniqueRes = isNameUnique(inputText, context);

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

type NameUniquenessResponse = true | false | "defaultEditedName";

export function isNameUnique(
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
