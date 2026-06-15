import { calcDeaths } from "../../pages/death-log/utils";
import type {
	DistinctTreeNode,
	Tree,
} from "../../model/tree-node-model/TreeNodeSchema";
import type { Death } from "../../model/tree-node-model/SubjectSchema";
import type { CategoryPoint, ScatterPoint, SunburstNode } from "../../model/stats-query-model/chart";
import { isoToDateSTD, isoToTimeSTD } from "../../utils/date";
import { assertIsNonNull, assertIsSubject } from "../../utils/asserts";

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

export function extractHierarchy(
	nodes: DistinctTreeNode[],
	tree: Tree,
	topN: number,
	threshold: number,
	maxDepth: number,
): SunburstNode[] {
	return nodes.map((node) =>
		buildSunburstNode(node, tree, 0, topN, threshold, maxDepth),
	);
}

function buildSunburstNode(
	node: DistinctTreeNode,
	tree: Tree,
	depth: number,
	topN: number,
	threshold: number,
	maxDepth: number,
): SunburstNode {
	if (depth + 1 >= maxDepth) {
		return { name: node.name, value: calcDeaths(node, tree) };
	}
	const allChildren = node.childIDS
		.map((id) => tree.get(id))
		.filter((child): child is DistinctTreeNode => child !== undefined)
		.sort((a, b) => calcDeaths(b, tree) - calcDeaths(a, tree));

	const total = calcDeaths(node, tree);
	const selected: DistinctTreeNode[] = [];
	let running = 0;
	for (const child of allChildren) {
		if (selected.length >= topN) break;
		selected.push(child);
		running += calcDeaths(child, tree);
		if (total > 0 && running / total >= threshold) break;
	}

	const children = selected.map((child) =>
		buildSunburstNode(child, tree, depth + 1, topN, threshold, maxDepth),
	);
	return {
		name: node.name,
		value: calcDeaths(node, tree),
		...(children.length > 0 ? { children } : {}),
	};
}

export function extractNodeScatter(
	nodes: DistinctTreeNode[],
	tree: Tree,
): ScatterPoint[] {
	return nodes
		.filter((node) => node.type === "subject" && node.timeSpent !== null)
		.map((node) => {
			assertIsSubject(node);
			assertIsNonNull(node.timeSpent);
			const [h, m, s] = node.timeSpent.split(":").map(Number);
			return {
				name: node.name,
				x: calcDeaths(node, tree),
				y: Math.round(h * 60 + m + s / 60),
			};
		});
}

export function extractDeathsByDay(
	deaths: Death[],
	tree: Tree,
): CategoryPoint[] {
	const dayMap: Record<
		string,
		{ count: number; subjects: Record<string, number> }
	> = {};
	for (const death of deaths) {
		const date = isoToDateSTD(death.timestamp);
		if (!dayMap[date]) dayMap[date] = { count: 0, subjects: {} };
		dayMap[date].count++;
		const name = tree.get(death.parentID)?.name ?? death.parentID;
		dayMap[date].subjects[name] = (dayMap[date].subjects[name] ?? 0) + 1;
	}
	return Object.entries(dayMap).map(([date, { count, subjects }]) => ({
		x: date,
		y: count,
		meta: Object.entries(subjects)
			.map(([name, n]) => `${name}: ${n}/${count}`)
			.join(", "),
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
