import Card from "../../components/card/Card";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import CardWrapper from "../../components/card/CardWrapper";
import type { Subject } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import useWarningStates from "../../hooks/useWarningStates";
import {
	handleDelete,
	handleAdd,
	handleCompletedStatus,
	handleCardModalSave,
	handleDeathCount,
} from "./eventHandlers";
import WarningModalBody from "../../components/modal/WarningModalBody";
import Modal from "../../components/modal/Modal";
import { ForceError } from "../ErrorPage";
import useLoadMainPageCorrectly from "../../hooks/useLoadMainPageCorrectly";

export default function Subjects({ profileID }: { profileID: string }) {
	const { tree, setTree, history, setHistory } = useMainPageContexts();
	const { modalRef: alertModalRef, alert, setAlert } = useWarningStates();
	const { loading, deletedID } = useLoadMainPageCorrectly(tree, profileID);

	return (
		<>
			{loading ? null : deletedID ? (
				<ForceError
					msg={
						"You just deleted the parent profile page! This page does not exist anymore!"
					}
				/>
			) : (
				<>
					<AddItemCard
						pageType="subject"
						handleAdd={(inputText, overrides) =>
							handleAdd(
								inputText,
								"subject",
								tree,
								setTree,
								history,
								setHistory,
								setAlert,
								alertModalRef,
								profileID,
								overrides,
							)
						}
					/>

					<CardWrapper
						cards={tree.get(profileID)?.childIDS.map((nodeID) => {
							const subject = tree.get(nodeID) as Subject;
							return (
								<Card
									key={subject.id}
									tree={tree}
									node={subject}
									handleCompletedStatus={() =>
										handleCompletedStatus(
											subject,
											!subject.completed,
											tree,
											setTree,
											history,
											setHistory,
											profileID,
										)
									}
									handleDelete={() =>
										handleDelete(
											subject,
											tree,
											setTree,
											history,
											setHistory,
											profileID,
										)
									}
									handleModalSave={(
										overrides,
										cardModalRef,
									) =>
										handleCardModalSave(
											subject,
											overrides,
											tree,
											setTree,
											history,
											setHistory,
											setAlert,
											alertModalRef,
											cardModalRef,
											profileID,
										)
									}
									handleDeathCount={(deathType, operation) =>
										handleDeathCount(
											subject,
											deathType,
											operation,
											tree,
											setTree,
											history,
											setHistory,
											profileID,
										)
									}
								/>
							);
						})}
					/>
					<Modal
						modalRef={alertModalRef}
						isWarningModal={true}
						modalBody={<WarningModalBody msg={alert} isReconfirm={false} isDeleteConfirm={false}/>}
					/>
				</>
			)}
		</>
	);
}
