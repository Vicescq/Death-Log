import { Link } from "react-router";
import { defaultEchartStyling } from "../../../../shared/defaults";

type Props =
	| { status: "no-data"; onShowAnyway?: never }
	| { status: "insufficient"; onShowAnyway: () => void };

function getContent(props: Props) {
	switch (props.status) {
		case "no-data":
			return {
				icon: (
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
					/>
				),
				heading: "Nothing logged yet",
				subtext: "Start logging deaths to see this chart.",
				cta: (
					<Link to="/log" className="btn btn-sm btn-info mt-1">
						Go to log →
					</Link>
				),
			};
		case "insufficient":
			return {
				icon: (
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
					/>
				),
				heading: "Not enough data",
				subtext:
					"Hidden due to sparse data. Log more in order to remove this overlay.",
				cta: (
					<button
						onClick={props.onShowAnyway}
						className="btn btn-sm btn-info mt-1"
					>
						Show anyway
					</button>
				),
			};
	}
}

export default function ChartEmpty(props: Props) {
	const { icon, heading, subtext, cta } = getContent(props);

	return (
		<div
			className="flex flex-col items-center justify-center gap-3"
			style={defaultEchartStyling}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="h-10 w-10"
			>
				{icon}
			</svg>
			<div className="text-center">
				<p className="font-semibold">{heading}</p>
				<p className="mt-1 text-sm">{subtext}</p>
			</div>
			{cta}
		</div>
	);
}
