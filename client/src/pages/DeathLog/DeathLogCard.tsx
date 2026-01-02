import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import DeathLogCardOptions from "./DeathLogCardOptions";

export default function DeathLogCard({
	node,
	entryNum,
}: {
	node: DistinctTreeNode;
	entryNum: number;
}) {
	const deaths =
		node.type == "game"
			? node.totalDeaths
			: node.type == "profile"
				? node.deathEntries.length
				: node.deaths;
	return (
		<li className="list-row sm:h-20">
			<div className="flex items-center justify-center">
				<span className="text-accent line-clamp-1 w-8 text-xs">
					{entryNum}
				</span>
				<div className="ml-2">
					<input
						type="checkbox"
						defaultChecked
						className="checkbox checkbox-sm checkbox-success"
					/>
				</div>
			</div>
			<div>
				<div className="line-clamp-3 sm:line-clamp-2 ">{node.name}</div>
				<div className="text-xs font-semibold uppercase opacity-60">
					{deaths}
				</div>
			</div>
			<DeathLogCardOptions node={node} />
		</li>
	);
}
