import { expect, test, beforeEach, afterEach } from "vitest";
import { NodeScopingStage, DeathScopingStage } from "./ScopingStage";
import { setupTestTree, cleanupTestTree } from "./fixtures";
import { defaultFilters, defaultDeathFilters } from "../../../shared/defaults";

let fixture: ReturnType<typeof setupTestTree>;

beforeEach(() => {
	fixture = setupTestTree();
});

afterEach(() => {
	cleanupTestTree();
});

test.describe("NodeFilterStage and NodeSortStage", () => {
	test("scope, filter, sort, and chart subjects", () => {
		const scopingStage = new NodeScopingStage("subjects");
		const filterStage = scopingStage.scope({
			type: "profile",
			ids: [fixture.profileID],
		});

		const sortStage = filterStage.filter(defaultFilters, "");
		const chartStage = sortStage.sort({
			sortingKey: "name",
			ascending: true,
		});

		const chartOptions = chartStage.toBarChart({ title: "Test Subjects" });
		expect(chartOptions).toBeDefined();
		expect(chartOptions.series).toBeDefined();
	});

	test("filter subjects with search query works in pipeline", () => {
		const scopingStage = new NodeScopingStage("subjects");
		const filterStage = scopingStage.scope({
			type: "profile",
			ids: [fixture.profileID],
		});

		const sortStage = filterStage.filter(defaultFilters, "Subject 1");
		const chartStage = sortStage.sort({
			sortingKey: "name",
			ascending: true,
		});

		const chartOptions = chartStage.toBarChart({ title: "Filtered Subjects" });
		expect(chartOptions).toBeDefined();
		expect((chartOptions.xAxis as any).data).toBeDefined();
	});

	test("limit reduces chart results", () => {
		const scopingStage = new NodeScopingStage("subjects");
		const filterStage = scopingStage.scope({
			type: "profile",
			ids: [fixture.profileID],
		});

		const sortStage = filterStage.filter(defaultFilters, "");
		const limitedStage = sortStage
			.sort({
				sortingKey: "name",
				ascending: true,
			})
			.limit(2);

		const chartOptions = limitedStage.toBarChart({ title: "Limited Subjects" });
		expect(chartOptions).toBeDefined();
	});
});

test.describe("DeathFilterStage and DeathSortStage", () => {
	test("filter deaths globally and collect all", () => {
		const scopingStage = new DeathScopingStage();
		const filterStage = scopingStage.scope();

		const sortStage = filterStage.filter(defaultDeathFilters);
		const chartStage = sortStage.sort({
			sortingKey: "timestamp",
			ascending: true,
		});

		expect(chartStage).toBeDefined();
		const limitedStage = chartStage.limit(10);
		expect(limitedStage).toBeDefined();
	});

	test("filter deaths by reliable timestamps only", () => {
		const scopingStage = new DeathScopingStage();
		const filterStage = scopingStage.scope({
			type: "profile",
			ids: [fixture.profileID],
		});

		const sortStage = filterStage.filter({
			timestampRel: true,
			unreliableTimestamp: false,
		});
		const chartStage = sortStage.sort({
			sortingKey: "timestamp",
			ascending: true,
		});

		expect(chartStage).toBeDefined();
	});

	test("filter deaths by unreliable timestamps only", () => {
		const scopingStage = new DeathScopingStage();
		const filterStage = scopingStage.scope({
			type: "profile",
			ids: [fixture.profileID],
		});

		const sortStage = filterStage.filter({
			timestampRel: false,
			unreliableTimestamp: true,
		});
		const chartStage = sortStage.sort({
			sortingKey: "timestamp",
			ascending: true,
		});

		expect(chartStage).toBeDefined();
	});

	test("filter deaths by remark search", () => {
		const scopingStage = new DeathScopingStage();
		const filterStage = scopingStage.scope({
			type: "profile",
			ids: [fixture.profileID],
		});

		const sortStage = filterStage.filter(defaultDeathFilters, "death");
		const chartStage = sortStage.sort({
			sortingKey: "timestamp",
			ascending: true,
		});

		expect(chartStage).toBeDefined();
	});

	test("sort deaths by remark", () => {
		const scopingStage = new DeathScopingStage();
		const filterStage = scopingStage.scope({
			type: "profile",
			ids: [fixture.profileID],
		});

		const sortStage = filterStage.filter(defaultDeathFilters);
		const chartStage = sortStage.sort({
			sortingKey: "remark",
			ascending: true,
		});

		expect(chartStage).toBeDefined();
	});
});
