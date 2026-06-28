import type { SunburstNode } from "../../model/stats-query-model/chart";
import type { SunburstLevel, SunburstPrune } from "../../model/stats-query-model/chart-spec";

export function rowsToSunburst(
	rows: Record<string, unknown>[],
	depth: number,
): SunburstNode[] {
	const roots: SunburstNode[] = [];
	for (const row of rows) {
		const y = Number(row.y);
		let siblings = roots;
		for (let level = 0; level < depth; level++) {
			const name = String(row[`l${level}`]);
			let node = siblings.find((n) => n.name === name);
			if (!node) {
				node = { name, value: 0, children: [] };
				siblings.push(node);
			}
			node.value += y;
			siblings = node.children;
		}
	}
	return roots;
}

export function applySunburstPrune(
	tree: SunburstNode[],
	levels: SunburstLevel[],
): SunburstNode[] {
	const total = tree.reduce((sum, n) => sum + n.value, 0);
	return pruneAtLevel(tree, total, levels, 0);
}

function pruneAtLevel(
	siblings: SunburstNode[],
	parentValue: number,
	levels: SunburstLevel[],
	depth: number,
): SunburstNode[] {
	const prune = levels[depth]?.prune;
	const { kept, dropped } = prune
		? keepGreedy(siblings, parentValue, prune)
		: { kept: siblings, dropped: [] as SunburstNode[] };
	const recursed = kept.map((node) =>
		node.children.length > 0
			? {
					...node,
					children: pruneAtLevel(node.children, node.value, levels, depth + 1),
				}
			: node,
	);
	if (dropped.length === 0 || prune?.showOther === false) return recursed;
	const otherValue = dropped.reduce((sum, n) => sum + n.value, 0);
	return [...recursed, { name: "Other", value: otherValue, children: [] }];
}

function keepGreedy(
	siblings: SunburstNode[],
	parentValue: number,
	prune: SunburstPrune,
): { kept: SunburstNode[]; dropped: SunburstNode[] } {
	const n = prune.mode === "threshold" ? Infinity : prune.topN;
	const pct = prune.mode === "topN" ? Infinity : prune.threshold;
	const sorted = [...siblings].sort((a, b) => b.value - a.value);
	const target = parentValue * pct;
	const kept: SunburstNode[] = [];
	let cumulative = 0;
	let i = 0;
	for (; i < sorted.length; i++) {
		if (kept.length >= n) break;
		if (cumulative + sorted[i].value > target) break;
		kept.push(sorted[i]);
		cumulative += sorted[i].value;
	}
	return { kept, dropped: sorted.slice(i) };
}
