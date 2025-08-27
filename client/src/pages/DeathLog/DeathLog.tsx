import AddItemCard from "../../components/addItemCard/AddItemCard";
import { addItemCardStressTest } from "../../components/addItemCard/utils";
import Card from "../../components/card/Card";
import CardWrapper from "../../components/card/CardWrapper";
import Modal from "../../components/modal/Modal";
import WarningModalBody from "../../components/modal/WarningModalBody";
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
	const { tree, setTree, history, setHistory } = useMainPageContexts();
	const { warningModalRef, warning, setWarning } = useWarningStates();
	const { loading, deletedID } = useLoadMainPageCorrectly(tree, parentID);

	return (
		<>
			{loading ? null : deletedID ? (
				<ForceError
					msg={`You just deleted the parent ${type} page! This page does not exist anymore!`}
				/>
			) : (
				<>
					{type != "subject" ? (
						<AddItemCard
							pageType={type}
							handleAdd={(inputText) =>
								handleAdd(
									inputText,
									type,
									tree,
									setTree,
									history,
									setHistory,
									setWarning,
									warningModalRef,
									parentID,
								)
							}
						/>
					) : (
						<AddItemCard
							pageType={type}
							handleAdd={(inputText, overrides) =>
								handleAdd(
									inputText,
									type,
									tree,
									setTree,
									history,
									setHistory,
									setWarning,
									warningModalRef,
									parentID,
									overrides,
								)
							}
						/>
					)}

					<CardWrapper
						cards={tree.get(parentID)?.childIDS.map((nodeID) => {
							const node = tree.get(nodeID) as DistinctTreeNode;
							if (type == "subject") {
								return (
									<Card
										key={JSON.stringify(node)} // forces local state to sync up with updated node, no need for useEffect
										tree={tree}
										node={node}
										handleDelete={() =>
											handleDelete(
												node,
												tree,
												setTree,
												history,
												setHistory,
												parentID,
											)
										}
										handleCompletedStatus={() =>
											handleCompletedStatus(
												node,
												tree,
												setTree,
												history,
												setHistory,
												parentID,
											)
										}
										handleModalSave={(
											overrides,
											cardModalRef,
										) =>
											handleCardModalSave(
												node,
												overrides,
												tree,
												setTree,
												history,
												setHistory,
												setWarning,
												warningModalRef,
												cardModalRef,
												parentID,
											)
										}
										handleDeathCount={(operation) => {
											handleDeathCount(
												node as Subject,
												operation,
												tree,
												setTree,
												history,
												setHistory,
												parentID,
											);
										}}
									/>
								);
							} else {
								return (
									<Card
										key={JSON.stringify(node)} // forces local state to sync up with updated node, no need for useEffect
										tree={tree}
										node={node}
										handleDelete={() =>
											handleDelete(
												node,
												tree,
												setTree,
												history,
												setHistory,
												parentID,
											)
										}
										handleCompletedStatus={() =>
											handleCompletedStatus(
												node,
												tree,
												setTree,
												history,
												setHistory,
												parentID,
											)
										}
										handleModalSave={(
											overrides,
											cardModalRef,
										) =>
											handleCardModalSave(
												node,
												overrides,
												tree,
												setTree,
												history,
												setHistory,
												setWarning,
												warningModalRef,
												cardModalRef,
												parentID,
											)
										}
									/>
								);
							}
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
