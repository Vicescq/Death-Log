import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type { Game } from "../../model/tree-node-model/GameSchema";
import type {
	Profile,
	ProfileGroup,
} from "../../model/tree-node-model/ProfileSchema";
import type { Subject } from "../../model/tree-node-model/SubjectSchema";
import type { Scope } from "../../model/stats-query-model/query";

export class TreeWalker {
	static games(tree: Tree): Game[] {
		const out: Game[] = [];
		for (const node of tree.values()) {
			if (node.type === "game") out.push(node);
		}
		return out;
	}

	static profileGroups(tree: Tree): ProfileGroup[] {
		const out: ProfileGroup[] = [];
		for (const node of tree.values()) {
			if (node.type !== "profile") continue;
			out.push(...node.groupings);
		}
		return out;
	}

	static profiles(tree: Tree): Profile[] {
		const out: Profile[] = [];
		for (const node of tree.values()) {
			if (node.type === "profile") out.push(node);
		}
		return out;
	}

	static profilesUnderGame(gameId: string, tree: Tree): Profile[] {
		const game = tree.get(gameId);
		if (game?.type !== "game") return [];
		const out: Profile[] = [];
		for (const id of game.childIDS) {
			const node = tree.get(id);
			if (node?.type === "profile") out.push(node);
		}
		return out;
	}

	static subjectsUnderProfile(profileId: string, tree: Tree): Subject[] {
		const profile = tree.get(profileId);
		if (profile?.type !== "profile") return [];
		return TreeWalker.resolveSubjects(profile.childIDS, tree);
	}

	static subjects(scope: Scope, tree: Tree): Subject[] {
		if (scope.length === 0) return TreeWalker.allSubjects(tree);

		const first = tree.get(scope[0]);
		if (!first) return TreeWalker.subjectsFromGroups(scope, tree);

		switch (first.type) {
			case "subject":
				return TreeWalker.resolveSubjects(scope, tree);
			case "profile":
				return scope.flatMap((id) =>
					TreeWalker.subjectsUnderProfile(id, tree),
				);
			case "game":
				return scope.flatMap((id) =>
					TreeWalker.subjectsUnderGame(id, tree),
				);
			default:
				return [];
		}
	}

	private static allSubjects(tree: Tree): Subject[] {
		const out: Subject[] = [];
		for (const node of tree.values()) {
			if (node.type === "subject") out.push(node);
		}
		return out;
	}

	private static resolveSubjects(ids: string[], tree: Tree): Subject[] {
		const out: Subject[] = [];
		for (const id of ids) {
			const node = tree.get(id);
			if (node?.type === "subject") out.push(node);
		}
		return out;
	}

	private static subjectsUnderGame(gameId: string, tree: Tree): Subject[] {
		return TreeWalker.profilesUnderGame(gameId, tree).flatMap((profile) =>
			TreeWalker.subjectsUnderProfile(profile.id, tree),
		);
	}

	private static subjectsFromGroups(
		groupIds: string[],
		tree: Tree,
	): Subject[] {
		const wanted = new Set(groupIds);
		const memberIds = TreeWalker.profileGroups(tree)
			.filter((group) => wanted.has(group.id))
			.flatMap((group) => group.members);
		return TreeWalker.resolveSubjects(memberIds, tree);
	}
}
