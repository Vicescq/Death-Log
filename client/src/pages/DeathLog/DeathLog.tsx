import { useMemo } from "react";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import Card from "../../components/card/Card";
import CardWrapper from "../../components/card/CardWrapper";
import { useTreeStore } from "../../hooks/StateManagers/useTreeStore";
import { ForceError } from "../ErrorPage";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import useLoadDeathLog from "../../hooks/useLoadDeathLog";

type Props = {
	type: "game" | "profile" | "subject";
	parentID: string;
};

export default function DeathLog({ type, parentID }: Props) {
	const tree = useTreeStore((state) => state.tree);
	const { loading, deletedID } = useLoadDeathLog(tree, parentID);

	const childIDS = tree.get(parentID)?.childIDS || [];
	const cards = useMemo(() => {
		return childIDS.map((nodeID) => <Card key={nodeID} id={nodeID} />);
	}, [childIDS, parentID]);

	useConsoleLogOnStateChange(tree, "TREE:", tree);

	return (
		<>
			{loading ? null : deletedID ? (
				<ForceError msg="You just deleted the parent page! This page does not exist anymore!" />
			) : (
				<>
					<AddItemCard pageType={type} parentID={parentID} />

					<CardWrapper cards={cards} />
				</>
			)}
		</>
	);
}
