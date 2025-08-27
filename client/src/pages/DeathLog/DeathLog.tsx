import { useEffect, useState } from "react";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import { addItemCardStressTest } from "../../components/addItemCard/utils";
import Card from "../../components/card/Card";
import CardWrapper from "../../components/card/CardWrapper";
import Modal from "../../components/modal/Modal";
import WarningModalBody from "../../components/modal/WarningModalBody";
import { useTreeStore } from "../../hooks/StateManager/useTreeStore";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import useLoadMainPageCorrectly from "../../hooks/useLoadMainPageCorrectly";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import useWarningStates from "../../hooks/useWarningStates";
import type { DistinctTreeNode, Subject } from "../../model/TreeNodeModel";
import { ForceError } from "../ErrorPage";
import {
	handleAdd,
	handleDelete,
	handleCompletedStatus,
	handleCardModalSave,
	handleDeathCount,
} from "./eventHandlers";

// note that the types do not have an "s" in order to be compatible with handleAdd types

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
	// const { tree, setTree, history, setHistory } = useMainPageContexts();
	const tree = useTreeStore((state) => state.tree);
	const initTree = useTreeStore((state) => state.initTree);
	const { warningModalRef, warning, setWarning } = useWarningStates();
	const { loading, deletedID } = useLoadMainPageCorrectly(tree, parentID);


	const [l2, setL2] = useState(false);

	useEffect(() => {
		if (tree.size == 0) {
			initTree([]);
			setL2(true);
		}
	}, [tree.size]);

	useConsoleLogOnStateChange(tree, "TREE: ", tree);

	return (
		<>
			{loading || !l2 ? null : deletedID ? (
				<ForceError
					msg={`You just deleted the parent page! This page does not exist anymore!`}
				/>
			) : (
				<>
					<AddItemCard pageType={type} parentID={parentID} />

					<CardWrapper
						cards={tree.get(parentID)?.childIDS.map((nodeID) => {
							const node = tree.get(nodeID) as DistinctTreeNode;

							return (
								<Card
									key={JSON.stringify(node)} // forces local state to sync up with updated node, no need for useEffect
									id={nodeID}
									parentID={parentID}
								/>
							);
						})}
					/>
					<Modal
						modalRef={warningModalRef}
						type="warning"
						modalBody={
							<WarningModalBody msg={warning} type="generic" />
						}
					/>
				</>
			)}
		</>
	);
}
