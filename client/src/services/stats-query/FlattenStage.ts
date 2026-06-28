import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type {
	DeathRow,
	SubjectRow,
	Tables,
} from "../../model/stats-query-model/chart";
import { assertIsNonNull } from "../../utils/asserts";
import { isoToLocalISO } from "../../utils/date";

export class FlattenStage {
	static flatten(tree: Tree): Tables {
		const deaths: DeathRow[] = [];
		const subjects: SubjectRow[] = [];

		for (const node of tree.values()) {
			if (node.type === "subject") {
				const profile = tree.get(node.parentID);
				assertIsNonNull(profile);

				const game = tree.get(profile.parentID);
				assertIsNonNull(game);

				subjects.push({
					id: node.id,
					name: node.name,
					context: node.context,
					dateStartLocal: isoToLocalISO(node.dateStart),
					dateStartRel: node.dateStartRel,
					dateEndLocal: node.dateEnd ? isoToLocalISO(node.dateEnd) : null,
					dateEndRel: node.dateEndRel,
					timeSpent: node.timeSpent,
					completed: node.completed,
					reoccurring: node.reoccurring,
					profileID: profile.id,
					profileName: profile.name,
					gameID: game.id,
					gameName: game.name,
					deaths: node.log.length,
					timeSpentMins: FlattenStage.timeSpentToMins(node.timeSpent),
				});

				for (const death of node.log) {
					deaths.push({
						id: death.id,
						timestampLocal: isoToLocalISO(death.timestamp),
						timestampRel: death.timestampRel,
						remark: death.remark,
						subjectID: node.id,
						subjectName: node.name,
						subjectContext: node.context,
						profileID: profile.id,
						profileName: profile.name,
						gameID: game.id,
						gameName: game.name,
					});
				}
			}
		}

		return { deaths, subjects };
	}

	private static timeSpentToMins(timeSpent: string | null): number {
		if (!timeSpent) return 0;
		const [h, m, s] = timeSpent.split(":").map(Number);
		if ([h, m, s].some((n) => Number.isNaN(n))) return 0;
		return h * 60 + m + s / 60;
	}
}
