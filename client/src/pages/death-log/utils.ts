import type {
	DistinctTreeNode,
	SubjectContext,
	Tree,
} from "../../model/TreeNodeModel";
import {
	createDeath,
	validateString,
	type ValidationContext,
} from "../../stores/utils";
import type { BreadcrumbMember } from "./DeathLogBreadcrumb";

export function calcRequiredPages(size: number, pageSize: number) {
	return Math.max(1, Math.ceil(size / pageSize));
}

export function paginateCardArray(
	paginatedCards: React.JSX.Element[][],
	cards: React.JSX.Element[],
	maxPage: number,
	maxItemPerPage: number,
) {
	let sliceIndexStart = 0;
	let sliceIndexEnd = maxItemPerPage;
	for (let i = 0; i < maxPage; i++) {
		paginatedCards.push(cards.slice(sliceIndexStart, sliceIndexEnd));
		sliceIndexStart += maxItemPerPage;
		sliceIndexEnd += maxItemPerPage;
	}
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

export function formatBreadcrumbMembers(
	breadcrumbMembers: BreadcrumbMember[],
	vpMatchedHighest: boolean,
	vpMatchedHigh: boolean,
	vpMatchedMid: boolean,
): BreadcrumbMember[] {
	let formattedBreadcrumbMembers: BreadcrumbMember[] = [
		{ name: "Death Log", link: "/log" },
		...breadcrumbMembers,
	];

	if (formattedBreadcrumbMembers.length == 4) {
		if (!vpMatchedMid) {
			// condense first 3
			formattedBreadcrumbMembers = [
				{
					link: "",
					name: "...",
					condensedMembers: [
						{
							name: formattedBreadcrumbMembers[0].name,
							link: formattedBreadcrumbMembers[0].link,
						},
						{
							name: formattedBreadcrumbMembers[1].name,
							link: formattedBreadcrumbMembers[1].link,
						},
						{
							name: formattedBreadcrumbMembers[2].name,
							link: formattedBreadcrumbMembers[2].link,
						},
					],
				},
				...formattedBreadcrumbMembers.slice(3),
			];
		} else if (!vpMatchedHigh) {
			// condense first 2
			formattedBreadcrumbMembers = [
				{
					link: "",
					name: "...",
					condensedMembers: [
						{
							name: formattedBreadcrumbMembers[0].name,
							link: formattedBreadcrumbMembers[0].link,
						},
						{
							name: formattedBreadcrumbMembers[1].name,
							link: formattedBreadcrumbMembers[1].link,
						},
					],
				},
				...formattedBreadcrumbMembers.slice(2),
			];
		} else if (!vpMatchedHighest) {
			// condense first
			formattedBreadcrumbMembers = [
				{
					link: "",
					name: "...",
					condensedMembers: [
						{
							name: formattedBreadcrumbMembers[0].name,
							link: formattedBreadcrumbMembers[0].link,
						},
					],
				},
				...formattedBreadcrumbMembers.slice(1),
			];
		}
	} else if (formattedBreadcrumbMembers.length == 3) {
		if (!vpMatchedMid) {
			// condense first 2
			formattedBreadcrumbMembers = [
				{
					link: "",
					name: "...",
					condensedMembers: [
						{
							name: formattedBreadcrumbMembers[0].name,
							link: formattedBreadcrumbMembers[0].link,
						},
						{
							name: formattedBreadcrumbMembers[1].name,
							link: formattedBreadcrumbMembers[1].link,
						},
					],
				},
				...formattedBreadcrumbMembers.slice(2),
			];
		} else if (!vpMatchedHigh) {
			// condense first
			formattedBreadcrumbMembers = [
				{
					link: "",
					name: "...",
					condensedMembers: [
						{
							name: formattedBreadcrumbMembers[0].name,
							link: formattedBreadcrumbMembers[0].link,
						},
					],
				},
				...formattedBreadcrumbMembers.slice(1),
			];
		}
	} else if (formattedBreadcrumbMembers.length == 2) {
		if (!vpMatchedMid) {
			// condense first
			formattedBreadcrumbMembers = [
				{
					link: "",
					name: "...",
					condensedMembers: [
						{
							name: formattedBreadcrumbMembers[0].name,
							link: formattedBreadcrumbMembers[0].link,
						},
					],
				},
				...formattedBreadcrumbMembers.slice(1),
			];
		}
	}
	return formattedBreadcrumbMembers;
}

export function canUserSubmitModalChanges(
	original: DistinctTreeNode,
	modalState: DistinctTreeNode,
	tree: Tree,
) {
	let nonNodeNameFieldChanged = false;

	if (
		formatUTCDate(original.dateStart) != formatUTCDate(modalState.dateStart)
	) {
		// time resets if change to same date: if clicked on 1/1/2026, but og is 1/1/2026 10:00, it will turn into 1/1/2026 00:00
		nonNodeNameFieldChanged = true;
	}

	if (
		original.dateEnd &&
		modalState.dateEnd &&
		formatUTCDate(original.dateEnd) != formatUTCDate(modalState.dateEnd)
	) {
		nonNodeNameFieldChanged = true;
	}

	if (original.dateStartRel != modalState.dateStartRel) {
		nonNodeNameFieldChanged = true;
	}

	if (original.dateEndRel != modalState.dateEndRel) {
		nonNodeNameFieldChanged = true;
	}

	if (original.notes != modalState.notes) {
		nonNodeNameFieldChanged = true;
	}

	if (original.type == "profile" && modalState.type == "profile") {
		if (original.groupings.length != modalState.groupings.length) {
			nonNodeNameFieldChanged = true;
		}

		// more cases like name changes
	}

	if (original.type == "subject" && modalState.type == "subject") {
		if (original.reoccurring != modalState.reoccurring) {
			nonNodeNameFieldChanged = true;
		}
		if (original.timeSpent != modalState.timeSpent) {
			nonNodeNameFieldChanged = true;
		}
		if (original.context != modalState.context) {
			nonNodeNameFieldChanged = true;
		}
	}

	const isNodeNameValidated = validateString(modalState.name, {
		type: "nodeEdit",
		parentID: modalState.parentID,
		tree: tree,
		originalName: "__NOT_USED__",
	}).valid;
	const unchangedNodeName = modalState.name == original.name;

	return (
		(nonNodeNameFieldChanged && unchangedNodeName) || isNodeNameValidated
	); // for user to save modal changes, at least one non name field must be eddited AND an unchanchaged name OR given a node's name was changed and is valid. Setup this way due to edge case of validateString on init validation of modalState.name being the same which returns invalid
}

export function computeModalInputTextError(
	currName: string,
	context: ValidationContext,
) {
	let inputTextError = "";
	const res = validateString(currName, context);

	if (context.type == "nodeAdd" || context.type == "profileGroupAdd") {
		if (!res.valid && res.cause != "empty" && res.msg) {
			inputTextError = res.msg;
		} else if (res.cause == "empty") {
			inputTextError = "";
		} else {
			inputTextError = "";
		}
	} else if (context.type == "nodeEdit") {
		if (!res.valid && context.originalName != currName && res.msg) {
			inputTextError = res.msg;
		} else if (
			res.cause == "nonunique" &&
			context.originalName == currName
		) {
			inputTextError = "";
		} else {
			inputTextError = "";
		}
	}

	return inputTextError;
}

export function stressTestDeathObjects(size: number, id: string) {
	return Array.from({ length: size }, () => createDeath(id));
}
