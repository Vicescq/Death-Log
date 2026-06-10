import { useDeathLogStore } from "../../stores/useDeathLogStore";
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
import { NodeFilterStage } from "./FilterStage";
import type { QueryNodeType } from "./StatsQuery";
import { DeathFilterStage } from "./FilterStage";

type ScopeType = "game" | "profile" | "group" | "subject";

type ScopeConfig = {
	type: ScopeType;
	ids: string[];
};

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
 * Scoping stage for node data (games, profiles, subjects)
 */
export class NodeScopingStage {
	private nodeType: QueryNodeType;

	constructor(nodeType: "games" | "profiles" | "subjects") {
		this.nodeType = nodeType;
	}

	scope(scope?: ScopeConfig): NodeFilterStage {
		const tree = useDeathLogStore.getState().tree;
		const actualScope = scope?.ids ?? "global";

		let data: DistinctTreeNode[];

		if (actualScope === "global") {
			const gameIDs = tree.get("ROOT_NODE")?.childIDS;
			assertIsNonNull(gameIDs);

			if (this.nodeType === "games") {
				data = gameIDs.map((id) => {
					const node = tree.get(id);
					assertIsNonNull(node);
					assertIsGame(node);
					return node;
				});
			} else {
				const profileIDs = getChildIDs(gameIDs, tree);

				if (this.nodeType === "profiles") {
					data = profileIDs.map((id) => {
						const node = tree.get(id);
						assertIsNonNull(node);
						assertIsProfile(node);
						return node;
					});
				} else {
					const subjectIDs = getChildIDs(profileIDs, tree);
					data = subjectIDs.map((id) => {
						const node = tree.get(id);
						assertIsNonNull(node);
						assertIsSubject(node);
						return node;
					});
				}
			}
		} else {
			// certain nodeType cases not due to impossiblity becasue of the methods that are available to invoke, see fetch stage

			if (this.nodeType === "profiles") {
				const profileIDs = getChildIDs(actualScope, tree);
				data = profileIDs.map((id) => {
					const node = tree.get(id);
					assertIsNonNull(node);
					assertIsProfile(node);
					return node;
				});
			} else {
				// nodeType === subject case only from here on out on this block
				let subjectIDs: string[];

				if (scope?.type == "game") {
					const profileIDs = getChildIDs(actualScope, tree);
					subjectIDs = getChildIDs(profileIDs, tree);
				} else if (scope?.type == "profile") {
					subjectIDs = getChildIDs(actualScope, tree);
				} else if (scope?.type == "group") {
					subjectIDs = this.resolveProfileGroupsToSubjects(
						scope.ids,
						tree,
					);
				} else {
					throw new Error("DEV ERROR! impossible case to reach!");
				}

				data = subjectIDs.map((id) => {
					const node = tree.get(id);
					assertIsNonNull(node);
					assertIsSubject(node);
					return node;
				});
			}
		}

		return new NodeFilterStage(data);
	}

	/**
	 * Have to aggregate group ids alongside their parent because of a chance of duplicate group ids and returning the group members. Group id uniqueness is localized
	 * @param groupAggregatedWithProfileIds
	 * @param tree
	 * @returns
	 */
	private resolveProfileGroupsToSubjects(
		groupAggregatedWithProfileIds: string[],
		tree: Tree,
	): string[] {
		// groupAggregatedWithProfileIds == <profile id>&<group id>
		const parsedProfileIDs = groupAggregatedWithProfileIds.map(
			(id) => id.split("&")[0],
		);
		const parsedGroupIDs = groupAggregatedWithProfileIds.map(
			(id) => id.split("&")[1],
		);
		const profileIdSet = new Set(parsedProfileIDs);
		const groupIdSet = new Set(parsedGroupIDs);
		const resolvedMembers: string[] = [];

		const allNodes = Array.from(tree.values());
		for (const node of allNodes) {
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
}

/**
 * Scoping stage for death data
 */
export class DeathScopingStage {
	scope(scope?: ScopeConfig): DeathFilterStage {
		const tree = useDeathLogStore.getState().tree;

		let subjectIDs: string[];

		// transform in terms of subject ids
		if (scope != undefined) {
			if (scope.type === "subject") {
				subjectIDs = scope.ids;
			} else if (scope.type === "profile") {
				subjectIDs = getChildIDs(scope.ids, tree);
			} else if (scope.type === "game") {
				const profileIDs = getChildIDs(scope.ids, tree);
				subjectIDs = getChildIDs(profileIDs, tree);
			} else {
				// profile group case, dont have to do anything, resolver called in fetch stage does the job
				subjectIDs = scope.ids;
			}
		} else {
			const gameIDs = tree.get("ROOT_NODE")?.childIDS;
			assertIsNonNull(gameIDs);
			const allProfileIDs = getChildIDs(gameIDs, tree);
			subjectIDs = getChildIDs(allProfileIDs, tree);
		}

		const data = subjectIDs
			.map((subjectID) => {
				const subject = tree.get(subjectID);
				assertIsNonNull(subject);
				assertIsSubject(subject);
				return subject.log;
			})
			.flat();

		return new DeathFilterStage(data);
	}
}
