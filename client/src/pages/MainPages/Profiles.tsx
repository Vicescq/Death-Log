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
import useMainPageStates from "../../hooks/useMainPageStates";
import AlertModalBody from "../../components/modal/AlertModalBody";
import Modal from "../../components/modal/Modal";
import { ForceError } from "../ErrorPage";
import { useEffect, useState } from "react";

export default function Profiles({ gameID }: { gameID: string }) {
	const { tree, setTree, history, setHistory } = useMainPageContexts();
	const { modalRef: alertModalRef, alert, setAlert } = useMainPageStates();
	const [loading, setLoading] = useState(true);
	{
		/* <ForceError
							msg={
								"You just deleted the parent game page! This page does not exist anymore!"
							}
						/> */
	}

	useEffect(() => {
		if (tree.size != 0) {
			setLoading(false);
		}
	}, [tree.size]);

	return (
		<>
			{loading ? null : (
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
								setAlert,
								alertModalRef,
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
											setAlert,
											alertModalRef,
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
				modalRef={alertModalRef}
				isAlertModal={true}
				modalBody={<AlertModalBody msg={alert} />}
			/>
		</>
	);
}
