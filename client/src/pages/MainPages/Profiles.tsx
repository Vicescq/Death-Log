import Card from "../../components/card/Card";
import CardWrapper from "../../components/card/CardWrapper";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import type { Profile } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import {
	handleAdd,
	handleCompletedStatus,
	handleDelete,
	handleModalSave,
} from "./eventHandlers";
import useMainPageStates from "../../hooks/useMainPageStates";
import AlertModalBody from "../../components/modal/AlertModalBody";
import Modal from "../../components/modal/Modal";

export default function Profiles({ gameID }: { gameID: string }) {
	const { tree, setTree, history, setHistory } = useMainPageContexts();
	const { modalRef, alert, setAlert } = useMainPageStates();

	function createCards() {
		return tree.get(gameID)?.childIDS.map((nodeID, index) => {
			const profile = tree.get(nodeID) as Profile;
			return (
				<Card
					key={index}
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
					handleModalSave={(overrides) =>
						handleModalSave(
							profile,
							overrides,
							tree,
							setTree,
							history,
							setHistory,
							setAlert,
							modalRef,
							gameID,
						)
					}
				/>
			);
		});
	}

	return (
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
						modalRef,
						gameID,
					)
				}
			/>
			<CardWrapper cards={createCards()} />
			<Modal
				modalRef={modalRef}
				isAlertModal={true}
				modalBody={<AlertModalBody msg={alert} />}
			/>
		</>
	);
}
