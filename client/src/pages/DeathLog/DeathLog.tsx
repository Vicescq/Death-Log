import { useEffect, useMemo } from "react";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import Card from "../../components/card/Card";
import CardWrapper from "../../components/card/CardWrapper";
import { useTreeStore } from "../../hooks/StateManagers/useTreeStore";
import useLoadMainPageCorrectly from "../../hooks/useLoadMainPageCorrectly";
import useWarningStates from "../../hooks/useWarningStates";
import { ForceError } from "../ErrorPage";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";

type GamesPage = {
	type: "game";
	parentID: "ROOT_NODE";
};

type ProfilesPage = {
	type: "profile";
	parentID: string;
};

type SubjectsPage = {
	type: "subject";
	parentID: string;
};

type Props = GamesPage | ProfilesPage | SubjectsPage;

export default function DeathLog({ type, parentID }: Props) {
	const tree = useTreeStore((state) => state.tree);
	const initTree = useTreeStore((state) => state.initTree);
	useEffect(() => {
		if (tree.size == 0) {
			initTree([]);
		}
	}, [tree.size]);

	const { warningModalRef, warning, setWarning } = useWarningStates();
	const { loading, deletedID } = useLoadMainPageCorrectly(tree, parentID);

	const childIDS = tree.get(parentID)?.childIDS || [];

	// const cards = useMemo(() => {
	// 	return childIDS.map((nodeID) => (
	// 		<Card key={nodeID} id={nodeID} parentID={parentID} />
	// 	));
	// }, [childIDS, parentID]);
	const cards = childIDS.map((nodeID) => (
		<Card key={nodeID} id={nodeID} parentID={parentID} />
	));

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
