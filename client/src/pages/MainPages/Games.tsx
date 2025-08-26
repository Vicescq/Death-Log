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
	handleCardModalSave,
} from "./eventHandlers";
import useMainPageStates from "../../hooks/useMainPageStates";
import type { Game } from "../../model/TreeNodeModel";
import useLoadMainPageCorrectly from "../../hooks/useLoadMainPageCorrectly";
import { ForceError } from "../ErrorPage";

export default function Games() {
	const { tree, setTree, history, setHistory } = useMainPageContexts();
	const { modalRef: alertModalRef, alert, setAlert } = useMainPageStates();
	const { loading } = useLoadMainPageCorrectly(tree, "ROOT_NODE");

	return (
		<>
			{loading ? null : (
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
								alertModalRef,
								"ROOT_NODE",
							)
						}
					/>
					<CardWrapper
						cards={tree.get("ROOT_NODE")?.childIDS.map((nodeID) => {
							const game = tree.get(nodeID) as Game;
							return (
								<Card
									key={game.id}
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
											"ROOT_NODE",
										)
									}
									handleModalSave={(
										overrides,
										cardModalRef,
									) =>
										handleCardModalSave(
											game,
											overrides,
											tree,
											setTree,
											history,
											setHistory,
											setAlert,
											alertModalRef,
											cardModalRef,
											"ROOT_NODE",
										)
									}
								/>
							);
						})}
					/>
					<Modal
						modalRef={alertModalRef}
						isAlertModal={true}
						modalBody={<AlertModalBody msg={alert} />}
					/>
				</>
			)}
		</>
	);
}
