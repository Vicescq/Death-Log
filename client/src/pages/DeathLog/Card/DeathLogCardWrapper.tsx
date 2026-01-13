import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import DeathLogCard from "./DeathLogCard";

type Props = {
	nodeID: string;
	entryNum: number;
};

export default function DeathLogCardWrapper({ nodeID, entryNum }: Props) {
	const node = useDeathLogStore((state) => state.tree.get(nodeID));
	if (node) {
		return <DeathLogCard node={node} entryNum={entryNum} />;
	} else return null;
}
