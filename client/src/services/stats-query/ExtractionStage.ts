import { calcDeaths } from "../../pages/death-log/utils";
import type {
	DistinctTreeNode,
	Tree,
} from "../../model/tree-node-model/TreeNodeSchema";
import type { Death } from "../../model/tree-node-model/SubjectSchema";
import type { CategoryPoint } from "./types/chart";
import { isoToDateSTD, isoToTimeSTD } from "../../utils/date";
import { assertIsNonNull } from "../../utils/asserts";

export function extractNodeDeaths(
	nodes: DistinctTreeNode[],
	tree: Tree,
): CategoryPoint[] {
	return nodes.map((node) => ({ x: node.name, y: calcDeaths(node, tree) }));
}

/**
 * Collect timestamp - death pairing
 * @param nodes 
 * @param dateExtract 
 * @param tree 
 * @returns 
 */
export function extractNodeTimeline(
	nodes: DistinctTreeNode[],
	dateExtract: "start" | "end",
	tree: Tree,
): CategoryPoint[] {
	if (dateExtract === "start") {
		return nodes.map((node) => ({
			x: isoToDateSTD(node.dateStart),
			y: calcDeaths(node, tree),
		}));
	}
	return nodes.map((node) => {
		assertIsNonNull(node.dateEnd);
		return { x: isoToDateSTD(node.dateEnd), y: calcDeaths(node, tree) };
	});
}

/**
 * For a given day and a set of death objs, get the amount of deaths that occured 
 * @param deaths 
 * @returns 
 */
export function extractDeathsByDay(deaths: Death[]): CategoryPoint[] {
	const dayToDeathCountMap: Record<string, number> = {};
	for (const death of deaths) {
		const date = isoToDateSTD(death.timestamp);
		dayToDeathCountMap[date] = (dayToDeathCountMap[date] ?? 0) + 1;
	}
	return Object.entries(dayToDeathCountMap).map(([date, count]) => ({
		x: date,
		y: count,
	}));
}

/**
 * Every given day and a set of death objs, get the death count + the previous days
 * @param deaths 
 * @returns 
 */
export function extractDeathsCumulative(deaths: Death[]): CategoryPoint[] {
	const dayToDeathCountMap: Record<string, number> = {};
	for (const death of deaths) {
		const datetime = `${isoToDateSTD(death.timestamp)}T${isoToTimeSTD(death.timestamp)}`;
		dayToDeathCountMap[datetime] = (dayToDeathCountMap[datetime] ?? 0) + 1;
	}

	let running = 0;
	return Object.keys(dayToDeathCountMap).map((date) => {
		running += dayToDeathCountMap[date];
		return { x: date, y: running };
	});
}
