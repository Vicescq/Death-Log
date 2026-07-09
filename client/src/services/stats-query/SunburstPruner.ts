import type { SunburstNode } from "../../model/stats-query-model/chart";

const TOP_GAMES = 5;
const PARENT_SHARE_CUTOFF = 0.5;
const OTHER_LABEL = "Other";

export class SunburstPruner {
	static prune(games: SunburstNode[]): SunburstNode[] {
		const total = games.reduce((sum, n) => sum + n.value, 0);
		return SunburstPruner.pruneLevel(games, total, 0);
	}

	private static pruneLevel(
		siblings: SunburstNode[],
		parentValue: number,
		depth: number,
	): SunburstNode[] {
		const kept =
			depth === 0
				? SunburstPruner.keepTopN(siblings, TOP_GAMES)
				: SunburstPruner.keepGreedyShare(siblings, parentValue);

		return kept.map((node) =>
			node.children.length > 0
				? {
						...node,
						children: SunburstPruner.pruneLevel(
							node.children,
							node.value,
							depth + 1,
						),
					}
				: node,
		);
	}

	private static keepTopN(
		siblings: SunburstNode[],
		n: number,
	): SunburstNode[] {
		const sorted = [...siblings].sort((a, b) => b.value - a.value);
		return SunburstPruner.withOther(sorted.slice(0, n), sorted.slice(n));
	}

	private static keepGreedyShare(
		siblings: SunburstNode[],
		parentValue: number,
	): SunburstNode[] {
		const target = parentValue * PARENT_SHARE_CUTOFF;
		const sorted = [...siblings].sort((a, b) => b.value - a.value);
		const kept: SunburstNode[] = [];
		let cumulative = 0;
		let i = 0;
		for (; i < sorted.length; i++) {
			if (kept.length > 0 && cumulative + sorted[i].value > target) break;
			kept.push(sorted[i]);
			cumulative += sorted[i].value;
		}
		return SunburstPruner.withOther(kept, sorted.slice(i));
	}

	private static withOther(
		kept: SunburstNode[],
		dropped: SunburstNode[],
	): SunburstNode[] {
		if (dropped.length === 0) return kept;
		const otherValue = dropped.reduce((sum, n) => sum + n.value, 0);
		return [
			...kept,
			{ name: OTHER_LABEL, value: otherValue, children: [] },
		];
	}
}
