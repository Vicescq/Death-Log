import { expect, test, beforeEach, afterEach } from "vitest";
import { scopeNodes, scopeDeaths } from "../ScopingStage";
import { setupTestTree, cleanupTestTree } from "./fixtures";
import {
	defaultFilters,
	defaultDeathFilters,
} from "../../../../shared/defaults";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import type { BarNodeQuery } from "../types/node-query";
import type { HmcDeathQuery } from "../types/death-query";

const baseNodeQ: Omit<BarNodeQuery, "fetch" | "scope"> = {
	title: "Test",
	filter: defaultFilters,
	sort: { sortingKey: "name", ascending: true },
	echartsConfig: {},
	extract: "nodeDeaths",
	chartType: "bar",
};

const baseDeathQ: Omit<HmcDeathQuery, "scope"> = {
	fetch: "deaths",
	title: "Test",
	filter: defaultDeathFilters,
	sort: { sortingKey: "timestamp", ascending: true },
	echartsConfig: {},
	extract: "deathsByDay",
	chartType: "hmc",
};

let fixture: ReturnType<typeof setupTestTree>;

beforeEach(() => {
	fixture = setupTestTree();
});

afterEach(() => {
	cleanupTestTree();
});

test("scopeNodes | globally for games", () => {
	const result = scopeNodes(
		{ ...baseNodeQ, fetch: "games", scope: { type: "global" } },
		useDeathLogStore.getState().tree,
	);
	expect(result.length).toBeGreaterThan(0);
	expect(result.every((n) => n.type === "game")).toBe(true);
});

test("scopeNodes | globally for profiles", () => {
	const result = scopeNodes(
		{ ...baseNodeQ, fetch: "profiles", scope: { type: "global" } },
		useDeathLogStore.getState().tree,
	);
	expect(result.length).toBeGreaterThan(0);
	expect(result.every((n) => n.type === "profile")).toBe(true);
});

test("scopeNodes | by game for profiles", () => {
	const result = scopeNodes(
		{
			...baseNodeQ,
			fetch: "profiles",
			scope: { type: "game", ids: [fixture.gameID] },
		},
		useDeathLogStore.getState().tree,
	);
	expect(result.length).toBeGreaterThan(0);
	expect(result.every((n) => n.type === "profile")).toBe(true);
});

test("scopeNodes | globally for subjects", () => {
	const result = scopeNodes(
		{ ...baseNodeQ, fetch: "subjects", scope: { type: "global" } },
		useDeathLogStore.getState().tree,
	);
	expect(result.length).toBeGreaterThan(0);
	expect(result.every((n) => n.type === "subject")).toBe(true);
});

test("scopeNodes | by profile for subjects", () => {
	const result = scopeNodes(
		{
			...baseNodeQ,
			fetch: "subjects",
			scope: { type: "profile", ids: [fixture.profileID] },
		},
		useDeathLogStore.getState().tree,
	);
	expect(result.length).toBeGreaterThan(0);
	expect(result.every((n) => n.type === "subject")).toBe(true);
});

test("scopeNodes | by profile group for subjects", () => {
	const result = scopeNodes(
		{
			...baseNodeQ,
			fetch: "subjects",
			scope: {
				type: "group",
				ids: [`${fixture.profileID}&${fixture.profileGroupID}`],
			},
		},
		useDeathLogStore.getState().tree,
	);
	expect(result.length).toBeGreaterThan(0);
	expect(result.every((n) => n.type === "subject")).toBe(true);
});

test("scopeDeaths | globally", () => {
	const result = scopeDeaths(
		{ ...baseDeathQ, scope: { type: "global" } },
		useDeathLogStore.getState().tree,
	);
	expect(result.length).toBeGreaterThan(0);
});

test("scopeDeaths | by game", () => {
	const result = scopeDeaths(
		{ ...baseDeathQ, scope: { type: "game", ids: [fixture.gameID] } },
		useDeathLogStore.getState().tree,
	);
	expect(result.length).toBeGreaterThan(0);
});

test("scopeDeaths | by profile", () => {
	const result = scopeDeaths(
		{ ...baseDeathQ, scope: { type: "profile", ids: [fixture.profileID] } },
		useDeathLogStore.getState().tree,
	);
	expect(result.length).toBeGreaterThan(0);
});

test("scopeDeaths | by subject", () => {
	const result = scopeDeaths(
		{
			...baseDeathQ,
			scope: { type: "subject", ids: [fixture.subjectIDs[0]] },
		},
		useDeathLogStore.getState().tree,
	);
	expect(result.length).toBeGreaterThan(0);
});
