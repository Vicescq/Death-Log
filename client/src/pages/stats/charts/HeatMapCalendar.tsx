import { useState, useMemo } from "react";
import ChartCard from "../components/ChartCard";
import ChartEmpty from "../components/ChartEmpty";
import ChartHideButton from "../components/ChartHideButton";
import EChartsReact from "react-echarts-library";
import darkerChalk from "../../../../shared/darker_chalk.json";
import { defaultEchartStyling } from "../../../../shared/defaults";
import { StatsQuery } from "../../../services/stats-query/StatsQuery";
import type { Query } from "../../../model/stats-query-model/query";
import ReliabilityToggle, {
	type ReliabilityFlag,
} from "../components/ReliabilityToggle";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import ArrowLeftIcon from "../../../components/icons/ArrowLeftIcon";
import ArrowRightIcon from "../../../components/icons/ArrowRightIcon";
import RefreshIcon from "../../../components/icons/RefreshIcon";

type Props = {
	initQuery: Extract<Query, { case: "flat" }>;
};

export default function HeatMapCalendar({ initQuery }: Props) {
	const [currentDate, setCurrentYear] = useState(new Date());
	const [query, setQuery] = useState(initQuery);
	const [showAnyway, setShowAnyway] = useState(false);
	const tree = useDeathLogStore((state) => state.tree);

	const baseYear = new Date().getFullYear();

	const result = useMemo(() => {
		const year = currentDate.getFullYear();
		const month = String(currentDate.getMonth() + 1).padStart(2, "0");
		return StatsQuery.run(
			{
				...query,
				echartsConfig: {
					...query.echartsConfig,
					range: `${year}-${month}`,
				},
			},
			tree,
		);
	}, [currentDate, query, tree]);

	const flags: ReliabilityFlag[] = [
		{
			label: "Unreliable data",
			value: query.includeUnreliableTimestamp ?? true,
			onToggle: () =>
				setQuery((p) => ({
					...p,
					includeUnreliableTimestamp: !(
						p.includeUnreliableTimestamp ?? true
					),
				})),
		},
	];

	const years = Array.from({ length: 5 }, (_, i) => baseYear - 2 + i);

	function handlePrevMonth() {
		setCurrentYear((prev) => {
			return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
		});
	}

	function handleNextMonth() {
		setCurrentYear(
			(prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
		);
	}

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	function handleReset() {
		const today = new Date();
		setCurrentYear(new Date(today.getFullYear(), today.getMonth(), 1));
	}

	return (
		<ChartCard
			title={query.title}
			settings={
				<>
					<ReliabilityToggle flags={flags} />
					<ChartHideButton
						visible={result.status === "insufficient" && showAnyway}
						onHide={() => setShowAnyway(false)}
					/>
				</>
			}
		>
			<div className="mb-4 flex gap-2">
				<button
					onClick={handlePrevMonth}
					className="btn btn-sm gap-2"
					aria-label="Previous month"
				>
					<ArrowLeftIcon />
					<span className="hidden sm:inline">Back</span>
				</button>

				<select
					value={currentDate.getMonth()}
					onChange={(e) => {
						const newMonth = parseInt(e.target.value);
						setCurrentYear(
							new Date(currentDate.getFullYear(), newMonth, 1),
						);
					}}
					className="select select-sm select-bordered max-w-xs flex-1"
				>
					{months.map((month, i) => (
						<option key={month} value={i}>
							{month}
						</option>
					))}
				</select>

				<select
					value={currentDate.getFullYear()}
					onChange={(e) => {
						const newYear = parseInt(e.target.value);
						setCurrentYear(
							new Date(newYear, currentDate.getMonth(), 1),
						);
					}}
					className="select select-sm select-bordered max-w-xs flex-1"
				>
					{years.map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>

				<button
					onClick={handleNextMonth}
					className="btn btn-sm gap-2"
					aria-label="Next month"
				>
					<span className="hidden sm:inline">Next</span>
					<ArrowRightIcon />
				</button>
			</div>

			{result.status === "no-data" ? (
				<ChartEmpty status="no-data" />
			) : result.status === "insufficient" && !showAnyway ? (
				<ChartEmpty
					status="insufficient"
					onShowAnyway={() => setShowAnyway(true)}
				/>
			) : (
				<div className="relative">
					<EChartsReact
						option={result.option}
						theme={darkerChalk}
						style={defaultEchartStyling}
					/>
					<button
						onClick={handleReset}
						className="btn btn-sm btn-ghost absolute right-4 bottom-4 gap-1"
						aria-label="Reset to current month"
						title="Reset to current month"
					>
						<RefreshIcon />
						<span className="hidden sm:inline">Today</span>
					</button>
				</div>
			)}
		</ChartCard>
	);
}
