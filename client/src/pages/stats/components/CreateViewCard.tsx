import { Link } from "react-router";

export default function CreateViewCard() {
	return (
		<Link
			to="/stats/build"
			className="bg-base-200 hover:bg-base-300 border-base-300 flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors"
		>
			<div className="flex-1 space-y-0.5">
				<p className="text-base font-semibold">New View</p>
				<p className="text-xs opacity-60">Create a custom chart view</p>
			</div>
			<span className="text-2xl leading-none opacity-40">+</span>
		</Link>
	);
}
