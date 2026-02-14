import DeathLogCardOptions from "./DeathLogCardOptions";
import loop from "../../../assets/loop.svg";
import skullRed from "../../../assets/skull_red.svg";
import { calcDeaths } from "../utils";
import type {
	DistinctTreeNode,
	Tree,
} from "../../../model/tree-node-model/TreeNodeSchema";

type Props = {
	node: DistinctTreeNode;
	entryNum: number;
	tree: Tree;
	onOpenCompletionModal: () => void;
};

export default function DeathLogCard({
	node,
	entryNum,
	tree,
	onOpenCompletionModal,
}: Props) {
	return (
		<li className={`list-row hover:bg-neutral rounded-none`} inert={false}>
			<div className="flex items-center justify-center">
				<span className="text-accent line-clamp-1 w-8">{entryNum}</span>
				<div>
					{node.type == "subject" && node.reoccurring ? (
						<img src={loop} alt="" className="w-6" />
					) : (
						<input
							type="checkbox"
							checked={node.completed}
							className="checkbox checkbox-sm checkbox-success"
							onChange={onOpenCompletionModal}
						/>
					)}
				</div>
			</div>
			<div className={`flex flex-col justify-center`}>
				<div
					className={`${node.completed ? "text-secondary line-through" : ""} line-clamp-4 sm:line-clamp-2`}
				>
					{node.name}
				</div>
				<div className="flex gap-2 font-semibold uppercase opacity-60">
					<img src={skullRed} alt="" className="w-4" />
					{calcDeaths(node, tree)}
				</div>
			</div>
			<DeathLogCardOptions node={node} />
		</li>
	);
}
