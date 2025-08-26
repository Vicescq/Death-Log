import Card from "../../components/card/Card";
import CardWrapper from "../../components/card/CardWrapper";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import type { Profile } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import {
	handleAdd,
	handleCompletedStatus,
	handleDelete,
	handleCardModalSave,
} from "./eventHandlers";
import useWarningStates from "../../hooks/useWarningStates";
import WarningModalBody from "../../components/modal/WarningModalBody";
import Modal from "../../components/modal/Modal";
import { ForceError } from "../ErrorPage";
import { useEffect, useState } from "react";
import useLoadMainPageCorrectly from "../../hooks/useLoadMainPageCorrectly";

export default function Profiles({ gameID }: { gameID: string }) {
	const { tree, setTree, history, setHistory } = useMainPageContexts();
	const { warningModalRef, warning, setWarning } = useWarningStates();
	const { loading, deletedID } = useLoadMainPageCorrectly(tree, gameID);

	return (
		<>
			{loading ? null : deletedID ? (
				<ForceError
					msg={
						"You just deleted the parent game page! This page does not exist anymore!"
					}
				/>
			) : (
				<>
					<AddItemCard
						pageType="profile"
						handleAdd={(inputText) =>
							handleAdd(
								inputText,
								"profile",
								tree,
								setTree,
								history,
								setHistory,
								setWarning,
								warningModalRef,
								gameID,
							)
						}
					/>
					<CardWrapper
						cards={tree.get(gameID)?.childIDS.map((nodeID) => {
							const profile = tree.get(nodeID) as Profile;
							return (
								<Card
									key={profile.id}
									tree={tree}
									node={profile}
									handleCompletedStatus={() =>
										handleCompletedStatus(
											profile,
											!profile.completed,
											tree,
											setTree,
											history,
											setHistory,
											gameID,
										)
									}
									handleDelete={() =>
										handleDelete(
											profile,
											tree,
											setTree,
											history,
											setHistory,
											gameID,
										)
									}
									handleModalSave={(
										overrides,
										cardModalRef,
									) =>
										handleCardModalSave(
											profile,
											overrides,
											tree,
											setTree,
											history,
											setHistory,
											setWarning,
											warningModalRef,
											cardModalRef,
											gameID,
										)
									}
								/>
							);
						})}
					/>
				</>
			)}

			<Modal
				modalRef={warningModalRef}
				type="warning"
				modalBody={<WarningModalBody msg={warning} type="generic" />}
			/>
		</>
	);
}
