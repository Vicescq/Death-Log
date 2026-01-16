import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import DeathLogCard from "./DeathLogCard";

type Props = {
	nodeID: string;
	entryNum: number;
};

export default function DeathLogCardWrapper({ nodeID, entryNum }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const node = tree.get(nodeID);
	if (!node) {
		return null;
	} else {
		return <DeathLogCard node={node} entryNum={entryNum} tree={tree} />;
	}
}
