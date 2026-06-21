import type { ChartSlot } from "../../model/stats-query-model/chart-slot";

export const PRESET_CHARTS: ChartSlot[] = [
	{
		id: "death-calendar",
		tab: "overview",
		spec: {
			type: "calendar",
			title: "Death Calendar",
			table: "deaths",
			sql: `SELECT SUBSTRING(timestampLocal, 1, 10) AS x, COUNT(*) AS y
			      FROM ?
			      WHERE {{REL}}
			      GROUP BY SUBSTRING(timestampLocal, 1, 10)`,
			whenReliable: "timestampRel = TRUE",
		},
	},
	{
		id: "top-10-bosses-by-deaths",
		tab: "overview",
		spec: {
			type: "bar",
			title: "Top 10 Bosses (Deaths)",
			table: "deaths",
			sql: `SELECT x, y FROM (
			        SELECT subjectName AS x, COUNT(*) AS y
			        FROM ?
			        WHERE subjectContext = 'Boss' AND {{REL}}
			        GROUP BY subjectName
			        ORDER BY y DESC
			        LIMIT 10
			      ) ORDER BY y ASC`,
		},
	},
	{
		id: "total-deaths-over-time",
		tab: "overview",
		spec: {
			type: "time-line",
			title: "Total Deaths Over Time",
			table: "deaths",
			sql: `SELECT SUBSTRING(timestampLocal, 1, 10) AS x, COUNT(*) AS y
			      FROM ?
			      WHERE {{REL}}
			      GROUP BY SUBSTRING(timestampLocal, 1, 10)
			      ORDER BY x ASC`,
			cumulative: true,
			whenReliable: "timestampRel = TRUE",
		},
	},
	{
		id: "hierarchy-of-deaths",
		tab: "overview",
		spec: {
			type: "sunburst",
			title: "Hierarchy of Deaths",
			table: "deaths",
			sql: `SELECT gameName AS l0, profileName AS l1, subjectName AS l2,
			             COUNT(*) AS y
			      FROM ?
			      WHERE {{REL}}
			      GROUP BY gameName, profileName, subjectName`,
			levels: [
				{ prune: { mode: "topN", topN: 5, threshold: 1 } },
				{
					prune: {
						mode: "topN",
						topN: 1,
						threshold: 0.5,
						showOther: true,
					},
				},
				{
					prune: {
						mode: "threshold",
						topN: 1,
						threshold: 0.5,
						showOther: false,
					},
				},
			],
		},
	},
	{
		id: "30-recent-Subjects",
		tab: "overview",
		spec: {
			type: "line",
			title: "30 Most Recent Subjects (Deaths)",
			table: "subjects",
			sql: `
					SELECT x, y FROM (
						SELECT name AS x, deaths AS y, dateStartLocal
						FROM ?
						WHERE {{REL}}
						ORDER BY dateStartLocal DESC
						LIMIT 30
					) ORDER BY dateStartLocal ASC
		  			`,
			whenReliable: "dateStartRel = TRUE",
		},
	},
	{
		id: "top-5-games-by-deaths",
		tab: "overview",
		spec: {
			type: "pie",
			title: "Top 5 Games by Deaths",
			table: "deaths",
			sql: `SELECT gameName AS x, COUNT(*) AS y
			      FROM ?
			      WHERE {{REL}}
			      GROUP BY gameName
			      ORDER BY y DESC
			      LIMIT 5`,
		},
	},
	{
		id: "deaths-by-context",
		tab: "overview",
		spec: {
			type: "bar",
			title: "Deaths by Context",
			table: "deaths",
			sql: `SELECT subjectContext AS x, COUNT(*) AS y
			      FROM ?
			      WHERE {{REL}}
			      GROUP BY subjectContext
			      ORDER BY y DESC`,
		},
	},
];
