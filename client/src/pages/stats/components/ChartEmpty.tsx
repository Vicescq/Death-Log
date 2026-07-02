import { Link } from "react-router";
import { defaultEchartStyling } from "../../../../shared/defaults";
import { useStatsContext } from "../hooks/useStatsContext";

export default function ChartEmpty() {
	const { isSharedPage } = useStatsContext();

	return (
		<div
			className="flex flex-col items-center justify-center gap-3"
			style={defaultEchartStyling}
		>
			<svg
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="h-10 w-10"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
				/>
			</svg>
			<div className="text-center">
				<p className="font-semibold">Nothing logged yet</p>
				{!isSharedPage && (
					<p className="mt-1 text-sm">
						Start logging deaths to see this chart.
					</p>
				)}
			</div>
			{!isSharedPage && (
				<Link to="/log" className="btn btn-sm btn-info mt-1">
					Go to log →
				</Link>
			)}
		</div>
	);
}
