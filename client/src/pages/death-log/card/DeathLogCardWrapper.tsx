import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import DeathLogCard from "./DeathLogCard";

type Props = {
	nodeID: string;
	entryNum: number;
	onOpenCompletionModal: () => void;
	onFocus: (node: DistinctTreeNode) => void;
};

export default function DeathLogCardWrapper({
	nodeID,
	entryNum,
	onOpenCompletionModal,
	onFocus,
}: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const node = tree.get(nodeID);
	if (!node) {
		return null;
	} else {
		return (
			<DeathLogCard
				node={node}
				entryNum={entryNum}
				tree={tree}
				onOpenCompletionModal={() => {
					onOpenCompletionModal();
					onFocus(node);
				}}
			/>
		);
	}
}
