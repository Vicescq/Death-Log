import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";
import type {
	ChartData,
	SunburstNode,
} from "../../../model/stats-query-model/chart";
import type { Query } from "../../../model/stats-query-model/query";
import { calcDeaths } from "../../../pages/death-log/utils";
import { SunburstPruner } from "../SunburstPruner";
import { TreeWalker } from "../TreeWalker";

export function deathsBySunburst(_query: Query, tree: Tree): ChartData {
	const games: SunburstNode[] = [];

	for (const gameNode of TreeWalker.games(tree)) {
		const gameValue = calcDeaths(gameNode, tree);
		if (gameValue === 0) continue;

		const profiles: SunburstNode[] = [];
		for (const profileNode of TreeWalker.profilesUnderGame(
			gameNode.id,
			tree,
		)) {
			const profileValue = calcDeaths(profileNode, tree);
			if (profileValue === 0) continue;

			const subjects: SunburstNode[] = [];
			for (const subjectNode of TreeWalker.subjectsUnderProfile(
				profileNode.id,
				tree,
			)) {
				const subjectValue = calcDeaths(subjectNode, tree);
				if (subjectValue === 0) continue;
				subjects.push({
					name: subjectNode.name,
					value: subjectValue,
					children: [],
				});
			}

			profiles.push({
				name: profileNode.name,
				value: profileValue,
				children: subjects,
			});
		}

		games.push({
			name: gameNode.name,
			value: gameValue,
			children: profiles,
		});
	}

	const nodes = SunburstPruner.prune(games);
	return { kind: "sunburst", nodes };
}

export function deathsByProfileGroup(_query: Query, tree: Tree): ChartData {
	const groups: SunburstNode[] = [];

	for (const group of TreeWalker.profileGroups(tree)) {
		const subjects: SunburstNode[] = [];
		let groupValue = 0;
		for (const subjectNode of TreeWalker.subjects([group.id], tree)) {
			const subjectValue = calcDeaths(subjectNode, tree);
			if (subjectValue === 0) continue;
			groupValue += subjectValue;
			subjects.push({
				name: subjectNode.name,
				value: subjectValue,
				children: [],
			});
		}
		if (groupValue === 0) continue;

		groups.push({
			name: group.title,
			value: groupValue,
			children: subjects,
		});
	}

	const nodes = SunburstPruner.prune(groups);
	return { kind: "sunburst", nodes };
}
