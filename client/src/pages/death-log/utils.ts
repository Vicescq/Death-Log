import type {
	DistinctTreeNode,
	Profile,
	ProfileGroup,
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

export type FormEditParams = ModalFormEditParams | ProfileGroupFormEditParams;

type ModalFormEditParams = {
	type: "modal";
	originalModal: DistinctTreeNode;
	modal: DistinctTreeNode;
};

type ProfileGroupFormEditParams = {
	type: "profile";
	originalProfileGroup: ProfileGroup;
	profile: ProfileGroup;
};

export function hasFormBeenEdited(formEditParams: FormEditParams) {
	return false;
}

export function getFormStatus(currName: string, context: ValidationContext) {
	let inputTextError = "";
	let submitBtnCSS = "btn-success";
	const res = validateString(currName, context);

	if (context.type == "nodeAdd" || context.type == "profileGroupAdd") {
		if (!res.valid && res.cause != "empty" && res.msg) {
			inputTextError = res.msg;
			submitBtnCSS = "btn-disabled";
		} else if (res.cause == "empty") {
			submitBtnCSS = "btn-disabled";
		}
	} else if (
		// acts as an else due to mutually exclusive events but did an else if for clarity
		context.type == "nodeEdit" ||
		context.type == "profileGroupEdit"
	) {
		if (!res.valid && context.originalName != currName && res.msg) {
			inputTextError = res.msg;
			submitBtnCSS = "btn-disabled";
		} else if (
			res.cause == "nonunique" &&
			context.originalName == currName
		) {
			submitBtnCSS = "btn-disabled";
		}
	}

	return { inputTextError, submitBtnCSS };
}

export function stressTestDeathObjects(size: number, id: string) {
	return Array.from({ length: size }, () => createDeath(id));
}
