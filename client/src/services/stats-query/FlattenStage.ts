import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import { isoToDateSTD, isoToTimeSTD } from "../../utils/date";

export type DeathRow = {
	id: string;
	timestamp: string;
	date: string;
	datetime: string;
	remark: string | null;
	timestampRel: boolean;
	subjectID: string;
	subjectName: string;
	subjectContext: string;
	profileID: string;
	profileName: string;
	gameID: string;
	gameName: string;
};

export type SubjectRow = {
	id: string;
	name: string;
	context: string;
	dateStart: string;
	dateCompleted: string | null;
	timeSpent: string | null;
	completed: boolean;
	reoccurring: boolean;
	profileID: string;
	profileName: string;
	gameID: string;
	gameName: string;
	deaths: number;
};

export type Tables = {
	deaths: DeathRow[];
	subjects: SubjectRow[];
};

export function flattenTree(tree: Tree): Tables {
	const deaths: DeathRow[] = [];
	const subjects: SubjectRow[] = [];

	for (const node of tree.values()) {
		if (node.type !== "subject") continue;

		const profile = tree.get(node.parentID);
		if (!profile || profile.type !== "profile") continue;

		const game = tree.get(profile.parentID);
		if (!game || game.type !== "game") continue;

		subjects.push({
			id: node.id,
			name: node.name,
			context: node.context,
			dateStart: node.dateStart,
			dateCompleted: node.dateEnd ?? null,
			timeSpent: node.timeSpent,
			completed: node.completed,
			reoccurring: node.reoccurring,
			profileID: profile.id,
			profileName: profile.name,
			gameID: game.id,
			gameName: game.name,
			deaths: node.log.length,
		});

		for (const death of node.log) {
			deaths.push({
				id: death.id,
				timestamp: death.timestamp,
				date: isoToDateSTD(death.timestamp),
				datetime: `${isoToDateSTD(death.timestamp)}T${isoToTimeSTD(death.timestamp)}`,
				remark: death.remark,
				timestampRel: death.timestampRel,
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

	return { deaths, subjects };
}
