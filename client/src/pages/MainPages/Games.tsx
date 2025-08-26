import Card from "../../components/card/Card";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import CardWrapper from "../../components/card/CardWrapper";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import Modal from "../../components/modal/Modal";
import WarningModalBody from "../../components/modal/WarningModalBody";
import {
	handleAdd,
	handleCompletedStatus,
	handleDelete,
	handleCardModalSave,
} from "./eventHandlers";
import useWarningStates from "../../hooks/useWarningStates";
import type { Game } from "../../model/TreeNodeModel";
import useLoadMainPageCorrectly from "../../hooks/useLoadMainPageCorrectly";

export default function Games() {
	const { tree, setTree, history, setHistory } = useMainPageContexts();
	const { warningModalRef, warning, setWarning } = useWarningStates();
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
								setWarning,
								warningModalRef,
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
									handleDelete={(confirmation) =>
										handleDelete(
											game,
											tree,
											setTree,
											history,
											setHistory,
											"ROOT_NODE",
											confirmation,
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
											setWarning,
											warningModalRef,
											cardModalRef,
											"ROOT_NODE",
										)
									}
								/>
							);
						})}
					/>
					<Modal
						modalRef={warningModalRef}
						isWarningModal={true}
						isWarningReconfirmModal={false}
						modalBody={
							<WarningModalBody
								msg={warning}
								isReconfirm={false}
								isDeleteReconfirm={false}
							/>
						}
					/>
				</>
			)}
		</>
	);
}
