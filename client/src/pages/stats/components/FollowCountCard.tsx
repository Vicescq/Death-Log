import { Link } from "react-router";
import ChevronRightIcon from "../../../components/icons/ChevronRightIcon";

type Props = {
	label: string;
	count: number | string;
	to: string;
	tone?: "accent" | "dark";
};

export default function FollowCountCard({
	label,
	count,
	to,
	tone = "accent",
}: Props) {
	const tile =
		tone === "dark"
			? "bg-black hover:bg-neutral-800 text-white"
			: "bg-accent/10 hover:bg-accent/25";
	const emphasis = tone === "dark" ? "text-white" : "text-accent";

	return (
		<Link
			to={to}
			className={`${tile} flex items-center justify-between gap-2 rounded-lg px-4 py-3`}
		>
			<div className="min-w-0">
				<div className={`${emphasis} truncate text-2xl font-bold`}>
					{count}
				</div>
				<div className="text-xs font-semibold uppercase opacity-70">
					{label}
				</div>
			</div>
			<span className={`${emphasis} shrink-0 opacity-70`}>
				<ChevronRightIcon />
			</span>
		</Link>
	);
}
