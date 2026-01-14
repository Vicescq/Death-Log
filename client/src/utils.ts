import type { DistinctTreeNode, Profile } from "./model/TreeNodeModel";

export function assertIsNonNull<T>(value: T): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error("DEV ERROR! Expected non nullable type is nullable!")
    }
}

export function assertIsProfile(value: DistinctTreeNode): asserts value is Profile {
    if (value.type != "profile") {
        throw new Error("DEV ERROR! Expected profile type is non profile!")
    }
}

export async function delay(ms: number) {
    await new Promise((resolve) =>
        setTimeout(resolve, ms),
    );
}