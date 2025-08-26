import Card from "../../components/card/Card";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import CardWrapper from "../../components/card/CardWrapper";
import type { Subject } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import useMainPageStates from "../../hooks/useMainPageStates";
import {
	handleDelete,
	handleAdd,
	handleCompletedStatus,
	handleCardModalSave,
	handleDeathCount,
} from "./eventHandlers";
import AlertModalBody from "../../components/modal/AlertModalBody";
import Modal from "../../components/modal/Modal";
import { ForceError } from "../ErrorPage";

export default function Subjects({ profileID }: { profileID: string }) {
	const { tree, setTree, history, setHistory } = useMainPageContexts();
	const { modalRef: alertModalRef, alert, setAlert } = useMainPageStates();

	return (
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
				cards={
					tree.get(profileID) ? (
						tree.get(profileID)!.childIDS.map((nodeID) => {
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
						})
					) : (
						<ForceError msg={"You just deleted the parent profile page! This page does not exist anymore!"} />
					)
				}
			/>
			<Modal
				modalRef={alertModalRef}
				isAlertModal={true}
				modalBody={<AlertModalBody msg={alert} />}
			/>
		</>
	);
}
