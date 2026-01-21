import type {
	DistinctTreeNode,
	Game,
	Profile,
	ProfileGroup,
	Subject,
	SubjectContext,
	Tree,
} from "../../model/TreeNodeModel";
import { createDeath, formatString } from "../../stores/utils";
import { validateString } from "../../stores/stringValidation";
import {
	type ValidationContextForm,
	type ValidationContextUniqueness,
} from "../../stores/stringValidation";

export function calcRequiredPages(size: number, pageSize: number) {
	return Math.max(1, Math.ceil(size / pageSize));
}

export function mapContextKeyToProperStr(contextKey: SubjectContext) {
	const subjectContextMap = {
		boss: "Boss",
		location: "Location",
		other: "Other",
		genericEnemy: "Generic Enemy",
		miniBoss: "Mini Boss",
	};
	return subjectContextMap[contextKey];
}

export function mapProperStrToContextKey(properStr: string): SubjectContext {
	const properStrMap: Record<string, SubjectContext> = {
		Boss: "boss",
		Location: "location",
		Other: "other",
		"Generic Enemy": "genericEnemy",
		"Mini Boss": "miniBoss",
	};
	return properStrMap[properStr];
}

export function calcDeaths(node: DistinctTreeNode, tree: Tree) {
	let sum = 0;
	switch (node.type) {
		case "game":
			node.childIDS.forEach((id) => {
				const profile = tree.get(id);
				if (profile) {
					profile.childIDS.forEach((id) => {
						const subject = tree.get(id);
						if (subject && subject.type == "subject") {
							sum += subject.log.length;
						}
					});
				}
			});
			return sum;
		case "profile":
			node.childIDS.forEach((id) => {
				const subject = tree.get(id);
				if (subject && subject.type == "subject") {
					sum += subject.log.length;
				}
			});
			return sum;
		case "subject":
			return node.log.length;
	}
}

export function formatUTCDate(isoSTR: string) {
	const dateObj = new Date(isoSTR);
	const year = String(dateObj.getFullYear());
	let month = String(dateObj.getMonth() + 1);
	let day = String(dateObj.getDate());
	if (month.length == 1) {
		month = "0" + month;
	}
	if (day.length == 1) {
		day = "0" + day;
	}
	return `${year}-${month}-${day}`;
}

export function parseUTCDate(formattedDateStr: string) {
	const parsedDate = formattedDateStr.split("-");
	const dateObj = new Date(
		Number(parsedDate[0]),
		Number(parsedDate[1]) - 1,
		Number(parsedDate[2]),
	);
	return dateObj.toISOString();
}

export function maxDate(isoSTR: string) {
	const dateObj = new Date(isoSTR);
	dateObj.setFullYear(dateObj.getFullYear() + 1);
	return formatUTCDate(dateObj.toISOString());
}

export type EditableForm = EditableNodeForm | EditableProfileGroupForm;

type EditableNodeForm = {
	type: "node";
	originalNode: DistinctTreeNode;
	node: DistinctTreeNode;
};

type EditableProfileGroupForm = {
	type: "profileGroup";
	originalProfileGroup: ProfileGroup;
	profileGroup: ProfileGroup;
};

export function hasFormBeenEdited(editableForm: EditableForm) {
	function checkIsEdited<
		T extends (keyof K)[],
		K extends Game | Profile | Subject | ProfileGroup,
	>(keys: T, form: K, orignalForm: K) {
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (key == "childIDS") continue;
			if (form[key] != orignalForm[key]) {
				return true;
			}
		}
		return false;
	}

	let isEdited = false;

	if (editableForm.type == "node") {
		if (
			editableForm.node.type == "game" &&
			editableForm.originalNode.type == "game"
		) {
			const keys = Object.keys(editableForm.node) as (keyof Game)[];
			isEdited = checkIsEdited(
				keys,
				editableForm.node,
				editableForm.originalNode,
			);
		} else if (
			editableForm.node.type == "profile" &&
			editableForm.originalNode.type == "profile"
		) {
			const keys = Object.keys(editableForm.node) as (keyof Profile)[];
			isEdited = checkIsEdited(
				keys,
				editableForm.node,
				editableForm.originalNode,
			);
		} else if (
			editableForm.node.type == "subject" &&
			editableForm.originalNode.type == "subject"
		) {
			const keys = Object.keys(editableForm.node) as (keyof Subject)[];
			isEdited = checkIsEdited(
				keys,
				editableForm.node,
				editableForm.originalNode,
			);
		}
	} else {
		const keys = Object.keys(
			editableForm.profileGroup,
		) as (keyof ProfileGroup)[];
		isEdited = checkIsEdited(
			keys,
			editableForm.profileGroup,
			editableForm.profileGroup,
		);
	}
	return isEdited;
}

export type GetFormStatusReturn = {
	inputTextError: string;
	submitBtnCSS: "btn-success" | "btn-disabled";
};

export function getFormStatus(
	currName: string,
	context: ValidationContextForm,
): GetFormStatusReturn {
	let inputTextError = "";
	let submitBtnCSS: "btn-success" | "btn-disabled" = "btn-success";

	let uniquenessContext: ValidationContextUniqueness;
	if (context.type == "nodeAdd" || context.type == "nodeEdit") {
		uniquenessContext = {
			type: "uniquenessNode",
			parentID: context.parentID,
			tree: context.tree,
		};
	} else {
		uniquenessContext = {
			type: "uniquenessProfileGroup",
			profile: context.profile,
		};
	}

	const res = validateString(currName, uniquenessContext);

	if (context.type == "nodeAdd" || context.type == "profileGroupAdd") {
		const invalidAndNotCausedByEmptyStr =
			!res.valid && res.cause != "empty";

		if (invalidAndNotCausedByEmptyStr && res.msg) {
			inputTextError = res.msg;
			submitBtnCSS = "btn-disabled";
		} else if (res.cause == "empty") {
			submitBtnCSS = "btn-disabled";
		}
	} else {
		if (context.editableForm.type == "node") {
			const invalidAndNotCausedByUniqueness =
				!res.valid && res.cause != "nonunique";

			const isDefaultFormState =
				!res.valid &&
				res.cause == "nonunique" &&
				!hasFormBeenEdited(context.editableForm) &&
				context.editableForm.node.name ==
					context.editableForm.originalNode.name;

			const actualInvalidNameUniquenessFormState =
				!res.valid &&
				res.cause == "nonunique" &&
				context.editableForm.node.name !=
					context.editableForm.originalNode.name;

			if (invalidAndNotCausedByUniqueness && res.msg) {
				inputTextError = res.msg;
				submitBtnCSS = "btn-disabled";
			} else if (isDefaultFormState) {
				submitBtnCSS = "btn-disabled";
			} else if (actualInvalidNameUniquenessFormState && res.msg) {
				inputTextError = res.msg;
				submitBtnCSS = "btn-disabled";
			}
		} else {
		}
	}

	return { inputTextError, submitBtnCSS };
}

export function stressTestDeathObjects(size: number, id: string) {
	return Array.from({ length: size }, () => createDeath(id));
}
