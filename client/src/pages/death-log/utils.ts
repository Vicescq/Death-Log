import type {
	DistinctTreeNode,
	Game,
	Profile,
	ProfileGroup,
	Subject,
	SubjectContext,
	Tree,
	TreeNode,
} from "../../model/TreeNodeModel";
import { createDeath } from "../../stores/utils";
import { validateStringTEMP } from "../../stores/stringValidation";
import { type ValidationContext } from "../../stores/stringValidation";
import { assertIsNonNull } from "../../utils";
import type { UseFormReturn } from "react-hook-form";
import type { FormDeath } from "./counter/DeathLogCounter";

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

export function toUTCDate(formattedDateStr: string, formattedTimeStr: string) {
	const parsedDate = formattedDateStr.split("-");
	const parsedTime = formattedTimeStr.split(":");
	const dateObj = new Date(
		Number(parsedDate[0]),
		Number(parsedDate[1]) - 1,
		Number(parsedDate[2]),
		Number(parsedTime[0]),
		Number(parsedTime[1]),
		Number(parsedTime[2]),
	);
	return dateObj.toISOString();
}

export function maxDate(isoSTR: string) {
	const dateObj = new Date(isoSTR);
	dateObj.setFullYear(dateObj.getFullYear() + 1);
	return formatUTCDate(dateObj.toISOString());
}

export function formatUTCTime(isoSTR: string) {
	const dateObj = new Date(isoSTR);
	const hour = dateObj.getHours();
	const mins = dateObj.getMinutes();
	const secs = dateObj.getSeconds();

	function addLeadingZeroes(time: number): string {
		return time >= 10 ? String(time) : `0${time}`;
	}

	return `${addLeadingZeroes(hour)}:${addLeadingZeroes(mins)}:${addLeadingZeroes(secs)}`;
}

export function hasFormBeenEdited(context: ValidationContext) {
	// couldnt find a way to not use type assertions in this function

	function checkIsEdited<
		T extends (keyof K)[],
		K extends Game | Profile | Subject | ProfileGroup,
	>(keys: T, form: K, orignalForm: K) {
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (key == "childIDS") continue;
			if (
				key == "dateStart" &&
				formatUTCDate(form[key] as string) !=
					formatUTCDate(orignalForm[key] as string)
			) {
				return true;
			} else if (
				key == "dateEnd" &&
				(form[key] as string) != null &&
				formatUTCDate(form[key] as string) !=
					formatUTCDate(orignalForm[key] as string)
			) {
				return true;
			} else if (
				form[key] != orignalForm[key] &&
				key != "dateStart" &&
				key != "dateEnd"
			) {
				return true;
			}
		}
		return false;
	}

	let isEdited = false;

	if (context.type == "nodeEdit") {
		if (
			context.node.type == "game" &&
			context.originalNode.type == "game"
		) {
			const keys = Object.keys(context.node) as (keyof Game)[];
			isEdited = checkIsEdited(keys, context.node, context.originalNode);
		} else if (
			context.node.type == "profile" &&
			context.originalNode.type == "profile"
		) {
			const keys = Object.keys(context.node) as (keyof Profile)[];
			isEdited = checkIsEdited(keys, context.node, context.originalNode);
		} else if (
			context.node.type == "subject" &&
			context.originalNode.type == "subject"
		) {
			const keys = Object.keys(context.node) as (keyof Subject)[];
			isEdited = checkIsEdited(keys, context.node, context.originalNode);
		}
	} else if (context.type == "profileGroupEdit") {
		const keys = Object.keys(
			context.profileGroup,
		) as (keyof ProfileGroup)[];
		isEdited = checkIsEdited(
			keys,
			context.profileGroup,
			context.originalProfileGroup,
		);
	} else {
		throw new Error(
			"DEV Error! Passed in incompatible validation context!",
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
	context: ValidationContext,
): GetFormStatusReturn {
	let inputTextError = "";
	let submitBtnCSS: "btn-success" | "btn-disabled" = "btn-success";

	const res = validateStringTEMP(currName, context);
	if (context.type == "nodeAdd" || context.type == "profileGroupAdd") {
		if (!(res.cause == "ok" || res.cause == "emptyAddDefault")) {
			inputTextError = res.msg;
			submitBtnCSS = "btn-disabled";
		} else if (res.cause == "emptyAddDefault") {
			submitBtnCSS = "btn-disabled";
		}
	} else {
		if (!(res.cause == "ok" || res.cause == "nonuniqueEditDefault")) {
			inputTextError = res.msg;
			submitBtnCSS = "btn-disabled";
		} else if (
			res.cause == "nonuniqueEditDefault" &&
			!hasFormBeenEdited(context)
		) {
			submitBtnCSS = "btn-disabled";
		}
	}

	return { inputTextError, submitBtnCSS };
}

// export function stressTestDeathObjects(size: number, id: string) {
// 	return Array.from({ length: size }, () => createDeath(id, null, true));
// }

export function sortChildIDS(parentNode: TreeNode, tree: Tree) {
	const sorted = parentNode.childIDS.toSorted((a, b) => {
		const nodeA = tree.get(a);
		const nodeB = tree.get(b);

		assertIsNonNull(nodeA);
		assertIsNonNull(nodeB);

		let result = 0;

		function applyWeights(node: DistinctTreeNode) {
			// non complete-> completed
			let weight = 0;
			if (node.completed) {
				weight = -100;
			} else {
				weight = 100;
			}
			return weight;
		}

		const nodeAWeights = applyWeights(nodeA);
		const nodeBWeights = applyWeights(nodeB);
		if (nodeAWeights == nodeBWeights) {
			if (nodeA.completed) {
				assertIsNonNull(nodeA.dateEnd);
				assertIsNonNull(nodeB.dateEnd);
				result = Date.parse(nodeB.dateEnd) - Date.parse(nodeA.dateEnd);
			} else {
				result =
					Date.parse(nodeB.dateStart) - Date.parse(nodeA.dateStart);
			}
		} else {
			result = nodeBWeights > nodeAWeights ? 1 : -1;
		}
		return result;
	});
	return sorted;
}

export function resolveTimestampUpdate(
	modalForm: UseFormReturn<FormDeath, any, FormDeath>,
	formData: FormDeath,
	focusedDeathID: string,
	subject: Subject,
) {
	let isoStr: string;
	const death = subject.log.find((death) => death.id == focusedDeathID);
	assertIsNonNull(death);
	if (
		modalForm.formState.dirtyFields.date &&
		modalForm.formState.dirtyFields.time
	) {
		isoStr = toUTCDate(formData.date, formData.time);
	} else if (
		modalForm.formState.dirtyFields.date &&
		!modalForm.formState.dirtyFields.time
	) {
		isoStr = toUTCDate(formData.date, formatUTCTime(death.timestamp));
	} else if (
		!modalForm.formState.dirtyFields.date &&
		modalForm.formState.dirtyFields.time
	) {
		isoStr = toUTCDate(formatUTCDate(death.timestamp), formData.time);
	} else {
		isoStr = death.timestamp;
	}
	return isoStr;
}
