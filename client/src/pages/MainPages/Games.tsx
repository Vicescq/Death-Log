import Card from "../../components/card/Card";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import CardWrapper from "../../components/card/CardWrapper";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import Modal from "../../components/modal/Modal";
import AlertModalBody from "../../components/modal/AlertModalBody";
import {
	handleAdd,
	handleCompletedStatus,
	handleDelete,
	handleModalSave,
} from "./eventHandlers";
import useMainPageStates from "../../hooks/useMainPageStates";
import type { Game } from "../../model/TreeNodeModel";

export default function Games() {
	const { tree, setTree, history, setHistory } = useMainPageContexts();
	const { modalRef, alert, setAlert } = useMainPageStates();

	function createCards() {
		return tree.get("ROOT_NODE")?.childIDS.map((nodeID, index) => {
			const game = tree.get(nodeID) as Game;
			return (
				<Card
					key={index}
					tree={tree}
					node={game}
					handleDelete={() =>
						handleDelete(
							game,
							tree,
							setTree,
							history,
							setHistory,
							"ROOT_NODE",
						)
					}
					handleCompletedStatus={() =>
						handleCompletedStatus(
							game,
							!game.completed,
							tree,
							setTree,
							history,
							setHistory,
							"ROOT_NODE"
						)
					}
					handleModalSave={(overrides) =>
						handleModalSave(
							game,
							overrides,
							tree,
							setTree,
							history,
							setHistory,
							setAlert,
							modalRef,
							"ROOT_NODE"
						)
					}
				/>
			);
		});
	}

	// useGetDeathLog(tree, setTree, user, setHistory);

	return (
		<>
			<AddItemCard
				pageType="game"
				handleAdd={(inputText) =>
					handleAdd(
						inputText,
						"game",
						tree,
						setTree,
						history,
						setHistory,
						setAlert,
						modalRef,
						"ROOT_NODE",
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
