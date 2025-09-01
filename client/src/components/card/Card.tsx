import { useNavigate } from "react-router";
import skull from "../../assets/skull.svg";
import add from "../../assets/add.svg";
import minus from "../../assets/minus.svg";
import step_into from "../../assets/step_into.svg";
import details from "../../assets/details.svg";
import readonly from "../../assets/readonly.svg";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import {
	createCardCSS,
	createCardMainPageTransitionState,
	getCardDeathCount,
	isCardModalStateEqual,
} from "./utils";
import { useTreeStore } from "../../stores/useTreeStore";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import Modal from "../modal/Modal";
import CardModalBody from "./CardModalBody";
import { useEffect } from "react";
import AlertModalBody from "../modal/AlertModalBody";
import useCardModals from "./useCardModals";

export default function Card({ id }: { id: string }) {
	let navigate = useNavigate();

	const node = useTreeStore((state) =>
		state.tree.get(id),
	) as DistinctTreeNode;
	const updateModalEditedNode = useTreeStore(
		(state) => state.updateModalEditedNode,
	);
	const updateNodeCompletion = useTreeStore(
		(state) => state.updateNodeCompletion,
	);
	const updateNodeDeaths = useTreeStore((state) => state.updateNodeDeaths);
	const deleteGame = useTreeStore((state) => state.deleteGame);
	const deleteProfile = useTreeStore((state) => state.deleteProfile);
	const deleteSubject = useTreeStore((state) => state.deleteSubject);

	const cardModals = useCardModals(node);

	const mainPageTransitionState = createCardMainPageTransitionState(node);
	const { cardCSS, settersCSS, highlightingCSS, reoccurringCSS } =
		createCardCSS(node);
	const deathCount = getCardDeathCount(node);

	function showSaveReconfirm() {
		if (isCardModalStateEqual(cardModals.card.state, node)) {
			cardModals.alert.set(
				"No changes have been saved since you edited nothing!",
			);
			cardModals.alert.props.set([
				{
					fn: () => {
						cardModals.alert.ref.current?.close();
						cardModals.card.ref.current?.showModal();
					},
					label: "CLOSE",
				},
			]);
		} else {
			cardModals.alert.set("Are you sure you want to edit this card?");
			cardModals.alert.props.set([
				{
					fn: () => {
						cardModals.alert.ref.current?.close();
						cardModals.card.ref.current?.showModal();
					},
					label: "CANCEL",
				},
				{
					fn: () => onSave(),
					label: "CONFIRM",
					btnCol: "bg-hunyadi",
				},
			]);
		}
		cardModals.card.ref.current?.close();
		cardModals.alert.ref.current?.showModal();
	}

	function showDeleteReconfirm() {
		cardModals.alert.set("Are you sure you want to delete this card?");
		cardModals.alert.props.set([
			{
				fn: () => {
					cardModals.alert.ref.current?.close();
					cardModals.card.ref.current?.showModal();
				},
				label: "CANCEL",
			},
			{
				fn: () => {
					switch (node.type) {
						case "game":
							deleteGame(node);
							break;
						case "profile":
							deleteProfile(node);
							break;
						case "subject":
							deleteSubject(node);
							break;
					}
				},
				label: "CONFIRM",
				btnCol: "bg-orange-700",
			},
		]);
		cardModals.alert.ref.current?.showModal();
		cardModals.card.ref.current?.close();
	}

	function showCompletionReconfirm() {
		if (node.completed) {
			cardModals.alert.set("Mark this card as incomplete?");
		} else {
			cardModals.alert.set("Mark this card as complete?");
		}

		cardModals.alert.props.set([
			{
				fn: () => {
					cardModals.alert.ref.current?.close();
				},
				label: "CANCEL",
			},
			{
				fn: () => {
					updateNodeCompletion(node);
					cardModals.alert.ref.current?.close();
				},
				label: "CONFIRM",
				btnCol: "bg-hunyadi",
			},
		]);
		cardModals.alert.ref.current?.showModal();
	}

	function onSave() {
		try {
			updateModalEditedNode(node, cardModals.card.state);
			cardModals.alert.ref.current?.close();
		} catch (e) {
			if (e instanceof Error) {
				cardModals.alert.set(e.message);
				cardModals.alert.props.set([
					{
						fn: () => {
							cardModals.alert.ref.current?.close();
							cardModals.card.ref.current?.showModal();
						},
						label: "CLOSE",
					},
				]);
			}
		}
	}

	function onCardModalClose() {
		if (!isCardModalStateEqual(cardModals.card.state, node)) {
			cardModals.card.set(node);
		}
		cardModals.card.ref.current?.close();
	}

	useEffect(() => {
		cardModals.card.set(node);
	}, [JSON.stringify(node)]);

	return (
		<div
			className={`flex border-4 border-black font-semibold ${cardCSS} h-54 w-60 rounded-xl p-2 shadow-[10px_8px_0px_rgba(0,0,0,1)] duration-200 ease-in-out hover:shadow-[20px_10px_0px_rgba(0,0,0,1)]`}
		>
			<div className="flex w-38 flex-col">
				<div className="bg-indianred flex gap-1 rounded-2xl border-2 border-black p-1 px-3 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
					<img className="w-6" src={skull} alt="" />
					<p className="mt-auto mb-auto truncate text-xl">
						{deathCount}
					</p>
				</div>

				<div className="mt-auto rounded-xl text-2xl">
					<p className="line-clamp-4 break-words">{node.name}</p>
				</div>
			</div>

			<div className="ml-auto flex flex-col gap-2">
				{node.type != "subject" ? (
					<img
						className={`w-9 ${highlightingCSS} cursor-pointer`}
						src={step_into}
						alt=""
						onClick={() =>
							navigate("/death-log", {
								state: mainPageTransitionState,
							})
						}
					/>
				) : (
					<>
						<img
							className={`w-9 cursor-pointer ${settersCSS}`}
							src={add}
							alt=""
							onClick={() => {
								updateNodeDeaths(node, "add");
							}}
						/>
						<img
							className={`w-9 cursor-pointer ${settersCSS}`}
							src={minus}
							alt=""
							onClick={() => {
								if (node.deaths != 0) {
									updateNodeDeaths(node, "subtract");
								}
							}}
						/>
					</>
				)}
				<img
					className={`w-9 cursor-pointer ${highlightingCSS}`}
					src={details}
					alt=""
					onClick={() => cardModals.card.ref.current?.showModal()}
				/>
				<img
					className={`w-9 cursor-pointer ${highlightingCSS} ${reoccurringCSS}`}
					src={readonly}
					alt=""
					onClick={() => showCompletionReconfirm()}
				/>
			</div>

			<Modal
				modalStyle="utility"
				body={
					<CardModalBody
						modalState={cardModals.card.state}
						setModalState={cardModals.card.set}
					/>
				}
				modalRef={cardModals.card.ref}
				closeFn={{
					fn: () => onCardModalClose(),
					label: "CLOSE",
				}}
				fn={{
					fn: () => showSaveReconfirm(),
					label: "SAVE",
					btnCol: "bg-hunyadi",
				}}
				fn2={{
					fn: () => showDeleteReconfirm(),
					label: "DELETE",
					btnCol: "bg-orange-700",
				}}
			/>

			<Modal
				modalStyle="alert"
				body={<AlertModalBody msg={cardModals.alert.state} />}
				modalRef={cardModals.alert.ref}
				closeFn={cardModals.alert.props.state[0]}
				fn={cardModals.alert.props.state[1]}
				fn2={cardModals.alert.props.state[2]}
			/>
		</div>
	);
}
