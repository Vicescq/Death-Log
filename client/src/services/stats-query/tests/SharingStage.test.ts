import { expect, test } from "vitest";
import { SharingStage } from "../SharingStage";
import type {
	ChartData,
	ChartSlot,
} from "../../../model/stats-query-model/chart";
import type { ChartSpec } from "../../../model/stats-query-model/chart-spec";

function slot(spec: Partial<ChartSpec> = {}): ChartSlot {
	return {
		id: "s1",
		tab: "Overview",
		spec: {
			type: "bar",
			title: "Deaths by Boss",
			table: "deaths",
			sql: "SELECT subjectName AS x, COUNT(*) AS y FROM ?",
			...spec,
		},
	};
}

const TZ =
	Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
		.formatToParts(new Date())
		.find((p) => p.type === "timeZoneName")?.value ?? "UTC";

test("maps category ChartData into the DTO's category field", () => {
	const data: ChartData = {
		kind: "category",
		points: [
			{ x: "Boss A", y: 3 },
			{ x: "Boss B", y: 1 },
		],
	};
	const shared = SharingStage.toSlot(slot(), data);
	expect(shared.id).toBe("s1");
	expect(shared.tab).toBe("Overview");
	expect(shared.spec.type).toBe("bar");
	expect(shared.spec.data.category).toEqual(data.points);
	expect(shared.spec.data.sunburst).toBeUndefined();
});

test("maps sunburst ChartData into the DTO's sunburst field", () => {
	const data: ChartData = {
		kind: "sunburst",
		nodes: [{ name: "Game A", value: 5, children: [] }],
	};
	const shared = SharingStage.toSlot(slot({ type: "sunburst" }), data);
	expect(shared.spec.data.sunburst).toEqual(data.nodes);
	expect(shared.spec.data.category).toBeUndefined();
});

test("non-temporal chart keeps its title unchanged", () => {
	const shared = SharingStage.toSlot(slot(), {
		kind: "category",
		points: [],
	});
	expect(shared.spec.title).toBe("Deaths by Boss");
});

test("temporal chart appends the owner's timezone to the title", () => {
	const shared = SharingStage.toSlot(
		slot({ type: "calendar", title: "Death Calendar", temporal: true }),
		{ kind: "category", points: [] },
	);
	expect(shared.spec.title).toBe(`Death Calendar (${TZ})`);
});

test("calendarRange is carried through when present", () => {
	const shared = SharingStage.toSlot(
		slot({ type: "calendar", temporal: true, calendarRange: "2024-06" }),
		{ kind: "category", points: [] },
	);
	expect(shared.spec.calendarRange).toBe("2024-06");
});

test("snapshot reflects whatever data Query produced (override already baked)", () => {
	const reliableOnly: ChartData = {
		kind: "category",
		points: [{ x: "Boss A", y: 2 }],
	};
	const shared = SharingStage.toSlot(slot(), reliableOnly);
	expect(shared.spec.data.category).toEqual([{ x: "Boss A", y: 2 }]);
});
