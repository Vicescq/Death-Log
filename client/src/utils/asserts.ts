import type { Game } from "../model/tree-node-model/GameSchema";
import type { Profile } from "../model/tree-node-model/ProfileSchema";
import type { Subject } from "../model/tree-node-model/SubjectSchema";
import type { DistinctTreeNode } from "../model/tree-node-model/TreeNodeSchema";

export function assertIsNonNull<T>(value: T): asserts value is NonNullable<T> {
	if (value === undefined || value === null) {
		throw new Error("DEV ERROR! Expected non nullable type is nullable!");
	}
}

export function assertIsDistinctTreeNode(
	value: any,
): asserts value is DistinctTreeNode {
	if (
		value.type != "game" &&
		value.type != "profile" &&
		value.type != "subject"
	) {
		throw new Error(
			"DEV ERROR! Expected DistinctTreeNode type is non DistinctTreeNode!",
		);
	}
}

export function assertIsGame(value: DistinctTreeNode): asserts value is Game {
	if (value.type != "game") {
		throw new Error("DEV ERROR! Expected game type is non game!");
	}
}

export function assertIsProfile(
	value: DistinctTreeNode,
): asserts value is Profile {
	if (value.type != "profile") {
		throw new Error("DEV ERROR! Expected profile type is non profile!");
	}
}

export function assertIsSubject(
	value: DistinctTreeNode,
): asserts value is Subject {
	if (value.type != "subject") {
		throw new Error("DEV ERROR! Expected subject type is non subject!");
	}
}
