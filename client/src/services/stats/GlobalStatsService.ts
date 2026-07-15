import { DebugService } from "../DebugService";
import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type { SubjectContext } from "../../model/tree-node-model/SubjectSchema";
import type { GlobalStatsCounts } from "../../model/DTOs/global-stats";

const DEV = DebugService.USE_DEV_CONSTANTS;

export class GlobalStatsService {
	static readonly SYNC_DEBOUNCE_MS = DEV ? 5_000 : 2 * 60_000;

	static computeSlice(tree: Tree): GlobalStatsCounts {
		let games = 0;
		let profiles = 0;
		let subjects = 0;
		let deaths = 0;

		const context: Record<SubjectContext, number> = {
			Boss: 0,
			"Mini Boss": 0,
			Location: 0,
			"Generic Enemy": 0,
			Other: 0,
		};

		for (const node of tree.values()) {
			switch (node.type) {
				case "game":
					games++;
					break;
				case "profile":
					profiles++;
					break;
				case "subject": {
					subjects++;
					deaths += node.log.length;
					context[node.context] += node.log.length;
					break;
				}
			}
		}

		return {
			deaths,
			games,
			profiles,
			subjects,
			bossDeaths: context.Boss,
			miniBossDeaths: context["Mini Boss"],
			locationDeaths: context.Location,
			genericDeaths: context["Generic Enemy"],
			otherDeaths: context.Other,
		};
	}
}
