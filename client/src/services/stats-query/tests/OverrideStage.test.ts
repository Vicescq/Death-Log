import { beforeEach, describe, expect, test, vi } from "vitest";
import LocalDB from "../../LocalDB";
import { OverrideStage } from "../OverrideStage";
import type { ChartSpec } from "../../../model/stats-query-model/chart-spec";

vi.mock("../../LocalDB", () => ({
	default: {
		getChartOverride: vi.fn(),
	},
}));

const mockGet = vi.mocked(LocalDB.getChartOverride);

beforeEach(() => {
	vi.clearAllMocks();
});

describe("OverrideStage.showUnreliable", () => {
	test("returns false when no override is stored", () => {
		mockGet.mockReturnValue({});
		expect(OverrideStage.showUnreliable("chart-1")).toBe(false);
	});

	test("returns stored true value", () => {
		mockGet.mockReturnValue({ showUnreliable: true });
		expect(OverrideStage.showUnreliable("chart-1")).toBe(true);
	});

	test("returns stored false value", () => {
		mockGet.mockReturnValue({ showUnreliable: false });
		expect(OverrideStage.showUnreliable("chart-1")).toBe(false);
	});
});

const base: ChartSpec = {
	type: "bar",
	title: "Original Title",
	table: "deaths",
	sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ? GROUP BY subjectName",
};

describe("OverrideStage.resolve — no token", () => {
	test("no {{REL}} token → spec unchanged", () => {
		mockGet.mockReturnValue({});
		expect(OverrideStage.resolve("id", base)).toEqual(base);
	});
});

const relSpec: ChartSpec = {
	type: "bar",
	title: "T",
	table: "deaths",
	sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ? WHERE {{REL}} GROUP BY subjectName",
	whenReliable: "timestampRel = TRUE",
};

describe("OverrideStage.resolve — {{REL}} token", () => {
	test("whenReliable + showUnreliable:false → predicate injected", () => {
		mockGet.mockReturnValue({ showUnreliable: false });
		const resolved = OverrideStage.resolve("id", relSpec);
		expect(resolved.sql).toContain("(timestampRel = TRUE)");
		expect(resolved.sql).not.toContain("{{REL}}");
	});

	test("whenReliable + showUnreliable:true → TRUE injected", () => {
		mockGet.mockReturnValue({ showUnreliable: true });
		const resolved = OverrideStage.resolve("id", relSpec);
		expect(resolved.sql).toContain("WHERE TRUE");
		expect(resolved.sql).not.toContain("{{REL}}");
	});

	test("no whenReliable + {{REL}} present → TRUE injected (safe no-op)", () => {
		const noReliable: ChartSpec = { ...relSpec, whenReliable: undefined };
		mockGet.mockReturnValue({});
		const resolved = OverrideStage.resolve("id", noReliable);
		expect(resolved.sql).toContain("WHERE TRUE");
		expect(resolved.sql).not.toContain("{{REL}}");
	});

	test("no {{REL}} in sql → sql untouched", () => {
		mockGet.mockReturnValue({ showUnreliable: false });
		const result = OverrideStage.resolve("id", base);
		expect(result.sql).toBe(base.sql);
	});

	test("multiple {{REL}} occurrences are all replaced", () => {
		mockGet.mockReturnValue({ showUnreliable: false });
		const multi: ChartSpec = {
			...relSpec,
			sql: "SELECT * FROM ? WHERE {{REL}} AND {{REL}}",
		};
		const resolved = OverrideStage.resolve("id", multi);
		expect(resolved.sql).not.toContain("{{REL}}");
		expect(resolved.sql.match(/timestampRel = TRUE/g)?.length).toBe(2);
	});
});
