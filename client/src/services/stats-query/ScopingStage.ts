import {
	assertIsGame,
	assertIsNonNull,
	assertIsProfile,
	assertIsSubject,
} from "../../utils/asserts";
import type {
	DistinctTreeNode,
	Tree,
} from "../../model/tree-node-model/TreeNodeSchema";
import type { Death } from "../../model/tree-node-model/SubjectSchema";
import type { NodeQuery } from "../../model/stats-query-model/node-query";
import type { DeathQuery } from "../../model/stats-query-model/death-query";

function getChildIDs(parentIDs: string[], tree: Tree): string[] {
	return parentIDs
		.map((parentID) => {
			const childIDs = tree.get(parentID)?.childIDS;
			assertIsNonNull(childIDs);
			return childIDs;
		})
		.flat();
}

/**
 * Group ids are aggregated with their parent profile id (<profileId>&<groupId>)
 * because group id uniqueness is only local to a profile.
 */
function resolveProfileGroupsToSubjects(
	groupAggregatedWithProfileIds: string[],
	tree: Tree,
): string[] {
	const parsedProfileIDs = groupAggregatedWithProfileIds.map(
		(id) => id.split("&")[0],
	);
	const parsedGroupIDs = groupAggregatedWithProfileIds.map(
		(id) => id.split("&")[1],
	);
	const profileIdSet = new Set(parsedProfileIDs);
	const groupIdSet = new Set(parsedGroupIDs);
	const resolvedMembers: string[] = [];

	for (const node of tree.values()) {
		if (node.type === "profile" && profileIdSet.has(node.id)) {
			for (const group of node.groupings) {
				if (groupIdSet.has(group.id)) {
					resolvedMembers.push(...group.members);
				}
			}
		}
	}

	return resolvedMembers;
}

export function scopeNodes(q: NodeQuery, tree: Tree): DistinctTreeNode[] {
	const scope = q.scope;

	if (scope.type === "global") {
		const gameIDs = tree.get("ROOT_NODE")?.childIDS;
		assertIsNonNull(gameIDs);

		if (q.fetch === "games") {
			return gameIDs.map((id) => {
				const node = tree.get(id);
				assertIsNonNull(node);
				assertIsGame(node);
				return node;
			});
		}

		const profileIDs = getChildIDs(gameIDs, tree);

		if (q.fetch === "profiles") {
			return profileIDs.map((id) => {
				const node = tree.get(id);
				assertIsNonNull(node);
				assertIsProfile(node);
				return node;
			});
		}

		const subjectIDs = getChildIDs(profileIDs, tree);
		return subjectIDs.map((id) => {
			const node = tree.get(id);
			assertIsNonNull(node);
			assertIsSubject(node);
			return node;
		});
	}

	if (q.fetch === "profiles") {
		const profileIDs = getChildIDs(scope.ids, tree);
		return profileIDs.map((id) => {
			const node = tree.get(id);
			assertIsNonNull(node);
			assertIsProfile(node);
			return node;
		});
	}

	// subjects — scoped by game, profile, or group
	let subjectIDs: string[];
	if (scope.type === "game") {
		const profileIDs = getChildIDs(scope.ids, tree);
		subjectIDs = getChildIDs(profileIDs, tree);
	} else if (scope.type === "profile") {
		subjectIDs = getChildIDs(scope.ids, tree);
	} else {
		subjectIDs = resolveProfileGroupsToSubjects(scope.ids, tree);
	}

	return subjectIDs.map((id) => {
		const node = tree.get(id);
		assertIsNonNull(node);
		assertIsSubject(node);
		return node;
	});
}

export function scopeDeaths(q: DeathQuery, tree: Tree): Death[] {
	const scope = q.scope;
	let subjectIDs: string[];

	if (scope.type === "global") {
		const gameIDs = tree.get("ROOT_NODE")?.childIDS;
		assertIsNonNull(gameIDs);
		const allProfileIDs = getChildIDs(gameIDs, tree);
		subjectIDs = getChildIDs(allProfileIDs, tree);
	} else if (scope.type === "subject") {
		subjectIDs = scope.ids;
	} else if (scope.type === "profile") {
		subjectIDs = getChildIDs(scope.ids, tree);
	} else if (scope.type === "game") {
		const profileIDs = getChildIDs(scope.ids, tree);
		subjectIDs = getChildIDs(profileIDs, tree);
	} else {
		// group — ids are already resolved to subject ids by the caller
		subjectIDs = scope.ids;
	}

	return subjectIDs.flatMap((subjectID) => {
		const subject = tree.get(subjectID);
		assertIsNonNull(subject);
		assertIsSubject(subject);
		return subject.log;
	});
}
