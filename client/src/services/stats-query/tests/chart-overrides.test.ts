import { beforeEach, describe, expect, test, vi } from "vitest";
import LocalDB from "../../LocalDB";
import { effectiveShowUnreliable, overrideSpec } from "../chart-overrides";
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

describe("effectiveShowUnreliable", () => {
	test("returns false when no override is stored", () => {
		mockGet.mockReturnValue({});
		expect(effectiveShowUnreliable("chart-1")).toBe(false);
	});

	test("returns stored true value", () => {
		mockGet.mockReturnValue({ showUnreliable: true });
		expect(effectiveShowUnreliable("chart-1")).toBe(true);
	});

	test("returns stored false value", () => {
		mockGet.mockReturnValue({ showUnreliable: false });
		expect(effectiveShowUnreliable("chart-1")).toBe(false);
	});
});

const base: ChartSpec = {
	type: "bar",
	title: "Original Title",
	table: "deaths",
	sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ? GROUP BY subjectName",
};

describe("overrideSpec — title", () => {
	test("no override → spec unchanged", () => {
		mockGet.mockReturnValue({});
		expect(overrideSpec("id", base)).toEqual(base);
	});

	test("non-blank title override is applied", () => {
		mockGet.mockReturnValue({ title: "Custom" });
		expect(overrideSpec("id", base).title).toBe("Custom");
	});

	test("blank title override is ignored", () => {
		mockGet.mockReturnValue({ title: "   " });
		expect(overrideSpec("id", base).title).toBe("Original Title");
	});

	test("empty string title override is ignored", () => {
		mockGet.mockReturnValue({ title: "" });
		expect(overrideSpec("id", base).title).toBe("Original Title");
	});
});

const relSpec: ChartSpec = {
	type: "bar",
	title: "T",
	table: "deaths",
	sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ? WHERE {{REL}} GROUP BY subjectName",
	whenReliable: "timestampRel = TRUE",
};

describe("overrideSpec — {{REL}} token", () => {
	test("whenReliable + showUnreliable:false → predicate injected", () => {
		mockGet.mockReturnValue({ showUnreliable: false });
		const resolved = overrideSpec("id", relSpec);
		expect(resolved.sql).toContain("(timestampRel = TRUE)");
		expect(resolved.sql).not.toContain("{{REL}}");
	});

	test("whenReliable + showUnreliable:true → TRUE injected", () => {
		mockGet.mockReturnValue({ showUnreliable: true });
		const resolved = overrideSpec("id", relSpec);
		expect(resolved.sql).toContain("WHERE TRUE");
		expect(resolved.sql).not.toContain("{{REL}}");
	});

	test("no whenReliable + {{REL}} present → TRUE injected (safe no-op)", () => {
		const noReliable: ChartSpec = { ...relSpec, whenReliable: undefined };
		mockGet.mockReturnValue({});
		const resolved = overrideSpec("id", noReliable);
		expect(resolved.sql).toContain("WHERE TRUE");
		expect(resolved.sql).not.toContain("{{REL}}");
	});

	test("no {{REL}} in sql → sql untouched", () => {
		mockGet.mockReturnValue({ showUnreliable: false });
		const result = overrideSpec("id", base);
		expect(result.sql).toBe(base.sql);
	});

	test("multiple {{REL}} occurrences are all replaced", () => {
		mockGet.mockReturnValue({ showUnreliable: false });
		const multi: ChartSpec = {
			...relSpec,
			sql: "SELECT * FROM ? WHERE {{REL}} AND {{REL}}",
		};
		const resolved = overrideSpec("id", multi);
		expect(resolved.sql).not.toContain("{{REL}}");
		expect(resolved.sql.match(/timestampRel = TRUE/g)?.length).toBe(2);
	});
});
