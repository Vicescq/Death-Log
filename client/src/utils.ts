import type { DistinctTreeNode, Profile, ProfileGroup, Subject } from "./model/TreeNodeModel";

export function assertIsNonNull<T>(value: T): asserts value is NonNullable<T> {
	if (value === undefined || value === null) {
		throw new Error("DEV ERROR! Expected non nullable type is nullable!");
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

export async function delay(ms: number) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}
