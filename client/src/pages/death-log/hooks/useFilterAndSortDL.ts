import type {
	DistinctTreeNode,
	Tree,
} from "../../../model/tree-node-model/TreeNodeSchema";
import LocalDB from "../../../services/LocalDB";
import { assertIsNonNull } from "../../../utils/asserts";
import type { Filters } from "../formSchemas";
import { calcDeaths, sortChildIDS } from "../utils";
import { dateTimeSTDToISO } from "../../../utils/date";

export default function useFilterAndSortDL(
	parent: DistinctTreeNode,
	tree: Tree,
): string[] {
	const filters = LocalDB.getDLFilterPrefs();
	if (filters != null) {
		const filteredIDs = parent.childIDS.filter((id) => {
			const node = tree.get(id);
			assertIsNonNull(node);

			const statusBoolVals: boolean[] = [];
			const relFlagBoolVals: boolean[] = [];
			const notesBoolVals: boolean[] = [];
			const dateRangeBoolVals: boolean[] = [];
			let passedDeathRange = false;
			let passedAzRange = false;

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
						statusBoolVals.push(
							filters[filterKey] && node.completed,
						);
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
							let operatorCandidates: (keyof typeof operators)[] =
								[];
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
					case "reliable":
						relFlagBoolVals.push(
							filters[filterKey] &&
								node.dateStartRel &&
								node.dateEndRel,
						);
						break;
					case "reoccurring":
						if (node.type == "subject") {
							statusBoolVals.push(
								filters[filterKey] && node.reoccurring,
							);
						}
						break;
					case "uncompleted":
						statusBoolVals.push(
							filters[filterKey] && !node.completed,
						);
						break;
					case "unreliable":
						relFlagBoolVals.push(
							filters[filterKey] &&
								!node.dateStartRel &&
								!node.dateEndRel,
						);
						break;
				}
			}

			return (
				statusBoolVals.some((bool) => bool) &&
				notesBoolVals.some((bool) => bool) &&
				relFlagBoolVals.some((bool) => bool) &&
				dateRangeBoolVals.every((bool) => bool) &&
				passedAzRange &&
				passedDeathRange
			);
		});
		return filteredIDs.toSorted((a, b) => {
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
					result =
						Date.parse(nodeB.dateEnd) - Date.parse(nodeA.dateEnd);
				} else {
					result =
						Date.parse(nodeB.dateStart) -
						Date.parse(nodeA.dateStart);
				}
			} else {
				result = nodeBWeights > nodeAWeights ? 1 : -1;
			}
			return result;
		});
	} else {
		return sortChildIDS(parent, tree);
	}
}
