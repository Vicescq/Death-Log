import { expect, test } from "vitest";
import { validateNameUniqueness } from "./general";

test("validateNameUniqueness | unique", () => {
	expect(validateNameUniqueness("Elden Ring", ["Silksong"], null)).toBe(true);
	expect(
		validateNameUniqueness("Elden Ring", ["Silksong", "Dark Souls"], null),
	).toBe(true);
});

test("validateNameUniqueness | non unique", () => {
	expect(validateNameUniqueness("Elden Ring", ["Elden Ring"], null)).toBe(
		false,
	);
	expect(
		validateNameUniqueness("Elden Ring", ["Elden Ring", "Silksong"], null),
	).toBe(false);
});

test("validateNameUniqueness | editing context, same name", () => {
	expect(
		validateNameUniqueness("Elden Ring", ["Silksong"], "Elden Ring"),
	).toBe(true);
});
