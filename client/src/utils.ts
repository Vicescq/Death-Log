export function assertIsNonNull<T>(value: T): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error("DEV ERROR! Expected non nullable type is nullable!")
    }
}