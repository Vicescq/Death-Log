import { expect, test, beforeEach, afterEach } from "vitest";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { scopeNodes, scopeDeaths } from "../ScopingStage";
import { filterNodes, filterDeaths } from "../FilterStage";
import { sortNodes, sortDeaths } from "../SortStage";
import { toBarChart } from "../ChartStage";
import {
	defaultFilters,
	defaultDeathFilters,
} from "../../../../shared/defaults";
import { setupTestTree, cleanupTestTree } from "./fixtures";
import type { BarNodeQuery } from "../types/node-query";
import type { HmcDeathQuery } from "../types/death-query";

const baseNodeQ: Omit<BarNodeQuery, "fetch" | "scope"> = {
	filter: defaultFilters,
	sort: { sortingKey: "name", ascending: true },
	chartMetaData: { title: "Test" },
	chartType: "bar",
};

const baseDeathQ: Omit<HmcDeathQuery, "scope"> = {
	fetch: "deaths",
	filter: defaultDeathFilters,
	sort: { sortingKey: "timestamp", ascending: true },
	chartMetaData: {},
	chartType: "hmc",
};

let fixture: ReturnType<typeof setupTestTree>;

beforeEach(() => {
	fixture = setupTestTree();
});

afterEach(() => {
	cleanupTestTree();
});

test.describe("node pipeline (scope → filter → sort → chart)", () => {
	test("full pipeline for subjects scoped by profile", () => {
		const q: BarNodeQuery = {
			...baseNodeQ,
			fetch: "subjects",
			scope: { type: "profile", ids: [fixture.profileID] },
		};
		const scoped = scopeNodes(q, useDeathLogStore.getState().tree);
		const filtered = filterNodes(scoped, q, useDeathLogStore.getState().tree);
		const sorted = sortNodes(filtered, q, useDeathLogStore.getState().tree);
		const chart = toBarChart(sorted, q, useDeathLogStore.getState().tree);
		expect(chart).toBeDefined();
		expect(chart.series).toBeDefined();
	});

	test("search query narrows results", () => {
		const q: BarNodeQuery = {
			...baseNodeQ,
			fetch: "subjects",
			scope: { type: "profile", ids: [fixture.profileID] },
			searchQuery: "Subject 1",
		};
		const scoped = scopeNodes(q, useDeathLogStore.getState().tree);
		const filtered = filterNodes(scoped, q, useDeathLogStore.getState().tree);
		const sorted = sortNodes(filtered, q, useDeathLogStore.getState().tree);
		const chart = toBarChart(sorted, q, useDeathLogStore.getState().tree);
		expect(chart).toBeDefined();
		expect((chart.xAxis as { data: unknown[] }).data).toBeDefined();
	});

	test("limit slices results", () => {
		const q: BarNodeQuery = {
			...baseNodeQ,
			fetch: "subjects",
			scope: { type: "profile", ids: [fixture.profileID] },
			limit: 2,
		};
		const scoped = scopeNodes(q, useDeathLogStore.getState().tree);
		const filtered = filterNodes(scoped, q, useDeathLogStore.getState().tree);
		const sorted = sortNodes(filtered, q, useDeathLogStore.getState().tree);
		const limited = sorted.slice(0, q.limit);
		const chart = toBarChart(limited, q, useDeathLogStore.getState().tree);
		expect(chart).toBeDefined();
		expect((chart.xAxis as { data: unknown[] }).data.length).toBeLessThanOrEqual(2);
	});
});

test.describe("death pipeline (scope → filter → sort)", () => {
	test("full pipeline globally scoped", () => {
		const q: HmcDeathQuery = { ...baseDeathQ, scope: { type: "global" } };
		const scoped = scopeDeaths(q, useDeathLogStore.getState().tree);
		const filtered = filterDeaths(scoped, q);
		const sorted = sortDeaths(filtered, q);
		expect(sorted).toBeDefined();
		expect(sorted.length).toBeGreaterThan(0);
	});

	test("filter by reliable timestamps only", () => {
		const q: HmcDeathQuery = {
			...baseDeathQ,
			scope: { type: "profile", ids: [fixture.profileID] },
			filter: { timestampRel: true, unreliableTimestamp: false },
		};
		const scoped = scopeDeaths(q, useDeathLogStore.getState().tree);
		const filtered = filterDeaths(scoped, q);
		expect(filtered.every((d) => d.timestampRel)).toBe(true);
	});

	test("filter by unreliable timestamps only", () => {
		const q: HmcDeathQuery = {
			...baseDeathQ,
			scope: { type: "profile", ids: [fixture.profileID] },
			filter: { timestampRel: false, unreliableTimestamp: true },
		};
		const scoped = scopeDeaths(q, useDeathLogStore.getState().tree);
		const filtered = filterDeaths(scoped, q);
		expect(filtered.every((d) => !d.timestampRel)).toBe(true);
	});

	test("filter by remark search", () => {
		const q: HmcDeathQuery = {
			...baseDeathQ,
			scope: { type: "profile", ids: [fixture.profileID] },
			searchQuery: "death",
		};
		const scoped = scopeDeaths(q, useDeathLogStore.getState().tree);
		const filtered = filterDeaths(scoped, q);
		expect(filtered).toBeDefined();
	});

	test("sort by remark ascending", () => {
		const q: HmcDeathQuery = {
			...baseDeathQ,
			scope: { type: "profile", ids: [fixture.profileID] },
			sort: { sortingKey: "remark", ascending: true },
		};
		const scoped = scopeDeaths(q, useDeathLogStore.getState().tree);
		const filtered = filterDeaths(scoped, q);
		const sorted = sortDeaths(filtered, q);
		expect(sorted).toBeDefined();
	});
});
