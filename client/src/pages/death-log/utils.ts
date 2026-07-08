import type {
	Subject,
	SubjectContext,
} from "../../model/tree-node-model/SubjectSchema";
import type {
	DistinctTreeNode,
	Tree,
} from "../../model/tree-node-model/TreeNodeSchema";
import type { ProfileGroup } from "../../model/tree-node-model/ProfileSchema";
import type { DeathLogViewPrefs } from "../../services/LocalDB";
import { createDeath } from "../../stores/utils";
import { assertIsNonNull, assertIsSubject } from "../../utils/asserts";
import { dateTimeSTDToISO } from "../../utils/date";
import type { Filters, SortSettings } from "../../model/formSchemas";

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
		case "ROOT_NODE":
			return 0; // should never pass ROOT_NODE into this
	}
}

export function stressTestDeathObjects(size: number, subject: Subject) {
	return Array.from({ length: size }, () => createDeath(subject, null, true));
}

export function filter(
	ids: string[],
	filters: Filters,
	tree: Tree,
	searchQuery: string,
	groupings: ProfileGroup[] = [],
): string[] {
	return ids.filter((id) => {
		const node = tree.get(id);
		assertIsNonNull(node);

		const statusBoolVals: boolean[] = [];
		const relFlagBoolVals: boolean[] = [];
		const notesBoolVals: boolean[] = [];
		const dateRangeBoolVals: boolean[] = [];
		const timeSpentBoolVals: boolean[] = [];
		const subjectContextBoolVals: boolean[] = [];
		let passedDeathRange = false;
		let passedAzRange = false;
		let passedGroupFilter = true;

		const nodeDatetime =
			node.completed && node.dateEnd ? node.dateEnd : node.dateStart;

		for (let key in filters) {
			const filterKey = key as keyof Filters;

			switch (filterKey) {
				case "azRange":
					const nodeFirstChar = node.name[0].toLowerCase();
					const filterAZ = filters[filterKey]
						.toLowerCase()
						.split("-");
					passedAzRange =
						nodeFirstChar >= filterAZ[0] &&
						nodeFirstChar <= filterAZ[1];
					break;
				case "completed":
					statusBoolVals.push(filters[filterKey] && node.completed);
					break;
				case "dateFrom":
					if (filters["dateRangeEnabled"]) {
						dateRangeBoolVals.push(
							Date.parse(
								dateTimeSTDToISO(
									filters[filterKey],
									"00:00:00",
								),
							) <= Date.parse(nodeDatetime),
						);
					}
					break;
				case "dateTo":
					if (filters["dateRangeEnabled"]) {
						dateRangeBoolVals.push(
							Date.parse(
								dateTimeSTDToISO(
									filters[filterKey],
									"00:00:00",
								),
							) >= Date.parse(nodeDatetime),
						);
					}
					break;
				case "deathRange":
					const deaths = calcDeaths(node, tree);
					const deathRangeArr = filters[filterKey].split("-");
					const isDeathRangeFormat1 = deathRangeArr.length > 1;
					if (isDeathRangeFormat1) {
						passedDeathRange =
							deaths >= Number(deathRangeArr[0]) &&
							deaths <= Number(deathRangeArr[1]);
					} else {
						const operators = {
							"=": (val: number) => deaths == val,
							">=": (val: number) => deaths >= val,
							">": (val: number) => deaths > val,
							"<": (val: number) => deaths < val,
							"<=": (val: number) => deaths <= val,
						};

						let foundOperatorAndNum = false;
						let operatorCandidates: (keyof typeof operators)[] = [];
						let operator: keyof typeof operators = "=";
						let num = 0;
						let i = 0;
						while (!foundOperatorAndNum) {
							const char = filters[filterKey][i];
							if (isNaN(Number(char))) {
								operatorCandidates.push(
									char as keyof typeof operators,
								);
							} else {
								operator = operatorCandidates.join(
									"",
								) as keyof typeof operators;
								num = Number(filters[filterKey].slice(i));
								foundOperatorAndNum = true;
							}
							i++;
						}

						passedDeathRange = operators[operator](num);
					}
					break;
				case "noNotes":
					notesBoolVals.push(
						filters[filterKey] && node.notes.length == 0,
					);
					break;
				case "notes":
					notesBoolVals.push(
						filters[filterKey] && node.notes.length > 0,
					);
					break;
				case "reliableStart":
					relFlagBoolVals.push(
						filters[filterKey] && node.dateStartRel,
					);
					break;
				case "reliableEnd":
					relFlagBoolVals.push(filters[filterKey] && node.dateEndRel);
					break;
				case "reoccurring":
					if (node.type == "subject") {
						statusBoolVals.push(
							filters[filterKey] && node.reoccurring,
						);
					}
					break;
				case "uncompleted":
					statusBoolVals.push(filters[filterKey] && !node.completed);
					break;
				case "unreliableStart":
					relFlagBoolVals.push(
						filters[filterKey] && !node.dateStartRel,
					);
					break;
				case "unreliableEnd":
					relFlagBoolVals.push(
						filters[filterKey] && !node.dateEndRel,
					);
					break;
				case "timeSpent":
					if (node.type == "subject") {
						timeSpentBoolVals.push(
							filters[filterKey] && node.timeSpent != null,
						);
					} else {
						timeSpentBoolVals.push(true);
					}
					break;
				case "noTimeSpent":
					if (node.type == "subject") {
						timeSpentBoolVals.push(
							filters[filterKey] && node.timeSpent == null,
						);
					} else {
						timeSpentBoolVals.push(true);
					}
					break;
				case "boss":
					if (node.type == "subject") {
						subjectContextBoolVals.push(
							filters[filterKey] && node.context == "Boss",
						);
					} else {
						subjectContextBoolVals.push(true);
					}
					break;
				case "location":
					if (node.type == "subject") {
						subjectContextBoolVals.push(
							filters[filterKey] && node.context == "Location",
						);
					} else {
						subjectContextBoolVals.push(true);
					}
					break;
				case "other":
					if (node.type == "subject") {
						subjectContextBoolVals.push(
							filters[filterKey] && node.context == "Other",
						);
					} else {
						subjectContextBoolVals.push(true);
					}
					break;
				case "genericEnemy":
					if (node.type == "subject") {
						subjectContextBoolVals.push(
							filters[filterKey] &&
								node.context == "Generic Enemy",
						);
					} else {
						subjectContextBoolVals.push(true);
					}
					break;
				case "miniBoss":
					if (node.type == "subject") {
						subjectContextBoolVals.push(
							filters[filterKey] && node.context == "Mini Boss",
						);
					} else {
						subjectContextBoolVals.push(true);
					}
					break;
				case "groupIDs": {
					const properlyMigratedGroupIDs = filters[filterKey].filter(
						// drops deleted profile groups that got persisted in local storage
						(groupID) => groupings.some((g) => g.id == groupID),
					);
					if (
						node.type == "subject" &&
						properlyMigratedGroupIDs.length > 0
					) {
						passedGroupFilter = properlyMigratedGroupIDs.some(
							(groupID) =>
								groupings
									.find((g) => g.id == groupID)
									?.members.includes(node.id),
						);
					}
					break;
				}
			}
		}

		return (
			node.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
			statusBoolVals.some((bool) => bool) &&
			notesBoolVals.some((bool) => bool) &&
			relFlagBoolVals.some((bool) => bool) &&
			dateRangeBoolVals.every((bool) => bool) &&
			timeSpentBoolVals.some((bool) => bool) &&
			subjectContextBoolVals.some((bool) => bool) &&
			passedAzRange &&
			passedDeathRange &&
			passedGroupFilter
		);
	});
}

export function sort(ids: string[], tree: Tree, sortSettings: SortSettings) {
	return ids.toSorted((a, b) => {
		const nodeA = tree.get(a);
		const nodeB = tree.get(b);

		assertIsNonNull(nodeA);
		assertIsNonNull(nodeB);

		function determineSortOrder(x: number, y: number) {
			if (sortSettings["ascending"]) {
				return x - y;
			} else {
				return y - x;
			}
		}

		function handleNullVals<T>(
			nullableValA: T | null,
			nullableValB: T | null,
			bothNonNullCaseCB: () => number,
		) {
			if (nullableValA == null && nullableValB == null) {
				return 0;
			} else if (nullableValA == null && nullableValB != null) {
				return 1;
			} else if (nullableValA != null && nullableValB == null) {
				return -1;
			} else {
				return bothNonNullCaseCB();
			}
		}

		switch (sortSettings["sortingKey"]) {
			case "completed":
				return handleNullVals(nodeA.dateEnd, nodeB.dateEnd, () => {
					// guranteed due to the last case being both non nulls. Have to use else because switch case linting gets mad
					assertIsNonNull(nodeA.dateEnd);
					assertIsNonNull(nodeB.dateEnd);

					return determineSortOrder(
						Date.parse(nodeA.dateEnd),
						Date.parse(nodeB.dateEnd),
					);
				});
			case "created":
				return determineSortOrder(
					Date.parse(nodeA.dateStart),
					Date.parse(nodeB.dateStart),
				);
			case "deaths":
				if (nodeA.type == "subject" && nodeB.type == "subject") {
					return determineSortOrder(
						nodeA.log.length,
						nodeB.log.length,
					);
				} else {
					return determineSortOrder(
						calcDeaths(nodeA, tree),
						calcDeaths(nodeB, tree),
					);
				}
			case "name":
				if (nodeA.name < nodeB.name) {
					return determineSortOrder(0, 1);
				} else if (nodeA.name > nodeB.name) {
					return determineSortOrder(1, 0);
				} else {
					// equal case
					return determineSortOrder(0, 0);
				}
			case "timeSpent":
				assertIsSubject(nodeA);
				assertIsSubject(nodeB);

				function parseTime(timeSpentSTR: string) {
					return timeSpentSTR
						.split(":")
						.map((str, i) =>
							i == 0
								? Number(str) * 60 * 60
								: i == 1
									? Number(str) * 60
									: Number(str),
						)
						.reduce((acc, val) => acc + val, 0);
				}

				return handleNullVals(nodeA.timeSpent, nodeB.timeSpent, () => {
					// same description as completed sort key case
					assertIsNonNull(nodeA.timeSpent);
					assertIsNonNull(nodeB.timeSpent);

					return determineSortOrder(
						parseTime(nodeA.timeSpent),
						parseTime(nodeB.timeSpent),
					);
				});
		}
	});
}

export type DeathLogViewType = Exclude<DistinctTreeNode["type"], "ROOT_NODE">;
export function getDeathlogViewType(
	parent: DistinctTreeNode,
): DeathLogViewType {
	switch (parent.type) {
		case "ROOT_NODE":
			return "game";
		case "game":
			return "profile";
		default:
			return "subject";
	}
}

export function constructInitPref<T>(defaultSettings: T): DeathLogViewPrefs<T> {
	return {
		game: defaultSettings,
		profile: defaultSettings,
		subject: defaultSettings,
	};
}
