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
import { useTreeStore } from "../../hooks/StateManagers/useTreeStore";
import useModal from "../../hooks/useModal";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import Modal from "../modal/Modal";
import CardModalBody from "./CardModalBody";
import { useEffect, type SetStateAction } from "react";
import AlertModalBody from "../modal/AlertModalBody";

export default function Card({ id }: { id: string }) {
	let navigate = useNavigate();

	const node = useTreeStore((state) =>
		state.tree.get(id),
	) as DistinctTreeNode;
	const updateNode = useTreeStore((state) => state.updateNode);
	const deleteNodes = useTreeStore((state) => state.deleteNodes);

	const {
		modalRef: cardModalRef,
		modalState: cardModalState,
		setModalState: setCardModalState,
	} = useModal(node);

	// confirm
	const {
		modalRef: cardModalConfirmRef,
		modalState: cardModalConfirmState,
		setModalState: setCardModalConfirmState,
	} = useModal("");

	// no changes
	const {
		modalRef: cardModalConfirmNCRef,
		modalState: cardModalConfirmNCState,
		setModalState: setCardModalConfirmNCState,
	} = useModal("");

	// del
	const {
		modalRef: cardModalConfirmDelRef,
		modalState: cardModalConfirmDelState,
		setModalState: setCardModalConfirmDelState,
	} = useModal("");

	// cancel changes
	const {
		modalRef: cardModalConfirmCCRef,
		modalState: cardModalConfirmCCState,
		setModalState: setCardModalConfirmCCState,
	} = useModal("");

	// general alerts
	const {
		modalRef: cardModalGeneralAlertRef,
		modalState: cardModalConfirmGeneralAlertState,
		setModalState: setCardModalConfirmGeneralAlertState,
	} = useModal("");

	const mainPageTransitionState = createCardMainPageTransitionState(node);
	const { cardCSS, settersCSS, highlightingCSS, reoccurringCSS } =
		createCardCSS(node);
	const deathCount = getCardDeathCount(node);

	useEffect(() => {
		setCardModalState(node);
	}, [JSON.stringify(node)]);

	useConsoleLogOnStateChange(cardModalState, "MODAL STATE", cardModalState);

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
								updateNode(node, {
									...node,
									deaths: node.deaths + 1,
								});
							}}
						/>
						<img
							className={`w-9 cursor-pointer ${settersCSS}`}
							src={minus}
							alt=""
							onClick={() => {
								if (node.deaths != 0) {
									updateNode(node, {
										...node,
										deaths: node.deaths - 1,
									});
								}
							}}
						/>
					</>
				)}
				<img
					className={`w-9 cursor-pointer ${highlightingCSS}`}
					src={details}
					alt=""
					onClick={() => cardModalRef.current?.showModal()}
				/>
				<img
					className={`w-9 cursor-pointer ${highlightingCSS} ${reoccurringCSS}`}
					src={readonly}
					alt=""
					onClick={() => {
						const nodeCopy: DistinctTreeNode = {
							...node,
							completed: !node.completed,
						};
						updateNode(node, nodeCopy);
					}}
				/>
			</div>

			<Modal
				modalStyle="utility"
				body={
					<CardModalBody
						modalState={cardModalState as DistinctTreeNode}
						setModalState={
							setCardModalState as React.Dispatch<
								React.SetStateAction<DistinctTreeNode>
							>
						}
					/>
				}
				modalRef={cardModalRef}
				negativeFn={() => {
					if (
						!isCardModalStateEqual(
							cardModalState as DistinctTreeNode,
							node,
						)
					) {
						cardModalConfirmCCRef.current?.showModal();
						cardModalRef.current?.close();
						setCardModalConfirmCCState(
							"Are you sure you want to exit without saving any changes?",
						);
					} else {
						cardModalRef.current?.close();
					}
				}}
				negativeFnBtnLabel={"CLOSE"}
				positiveFn={() => {
					if (
						!isCardModalStateEqual(
							cardModalState as DistinctTreeNode,
							node,
						)
					) {
						setCardModalConfirmState(
							"Are you sure you want to edit this card?",
						);
						cardModalConfirmRef.current?.showModal();
						cardModalRef.current?.close();
					} else {
						setCardModalConfirmNCState(
							"Cannot save! You have not made any changes!",
						);
						cardModalConfirmNCRef.current?.showModal();
						cardModalRef.current?.close();
					}
				}}
				positiveFnBtnLabel="SAVE"
				positiveFnBtnCol="bg-hunyadi"
				negativeFn2={() => {
					cardModalRef.current?.close();
					cardModalConfirmDelRef.current?.showModal();
					setCardModalConfirmDelState(
						"Are you sure you want to delete this card?",
					);
				}}
				negativeFn2BtnLabel="DELETE"
			/>

			{/* Modal for save confirm */}
			<Modal
				modalStyle="alert"
				body={<AlertModalBody msg={cardModalConfirmState as string} />}
				modalRef={cardModalConfirmRef}
				negativeFn={() => {
					cardModalConfirmRef.current?.close();
					cardModalRef.current?.showModal();
				}}
				negativeFnBtnLabel={"CANCEL"}
				positiveFn={() => {
					try{
						updateNode(node, cardModalState as DistinctTreeNode);
						cardModalConfirmRef.current?.close();
					}
					catch (e){
						if(e instanceof Error){
							// setCardModalConfirmGeneralAlertState(e.message);
							// cardModalGeneralAlertRef.current?.showModal();
							cardModalConfirmRef.current?.close();
						}
					}
				}}
				positiveFnBtnLabel="CONFIRM"
				positiveFnBtnCol="bg-hunyadi"
			/>

			{/* Modal for no changes alert */}
			<Modal
				modalStyle="alert"
				body={
					<AlertModalBody msg={cardModalConfirmNCState as string} />
				}
				modalRef={cardModalConfirmNCRef}
				negativeFn={() => {
					cardModalConfirmNCRef.current?.close();
					cardModalRef.current?.showModal();
				}}
				negativeFnBtnLabel={"CLOSE"}
			/>

			{/* Modal for delete confirm */}
			<Modal
				modalStyle="alert"
				body={
					<AlertModalBody msg={cardModalConfirmDelState as string} />
				}
				modalRef={cardModalConfirmDelRef}
				negativeFn={() => {
					cardModalConfirmDelRef.current?.close();
					cardModalRef.current?.showModal();
				}}
				negativeFnBtnLabel={"CANCEL"}
				negativeFn2={() => {
					deleteNodes(node);
					cardModalConfirmDelRef.current?.close();
				}}
				negativeFn2BtnLabel="DELETE"
			/>

			{/* Modal for cancelling any changes */}
			<Modal
				modalStyle="alert"
				body={
					<AlertModalBody msg={cardModalConfirmCCState as string} />
				}
				modalRef={cardModalConfirmCCRef}
				negativeFn={() => {
					cardModalConfirmCCRef.current?.close();
					setCardModalState(node);
				}}
				negativeFnBtnLabel={"EXIT"}
				positiveFn={() => {
					cardModalConfirmCCRef.current?.close();
					cardModalRef.current?.showModal();
				}}
				positiveFnBtnLabel="GO BACK"
				positiveFnBtnCol="bg-gray-500"
			/>

			{/* Alert stuff */}
			{/* <Modal
				modalStyle="alert"
				body={
					<AlertModalBody msg={cardModalConfirmGeneralAlertState as string} />
				}
				modalRef={cardModalGeneralAlertRef}
				negativeFn={() => {
					cardModalGeneralAlertRef.current?.close();
				}}
				negativeFnBtnLabel={"CLOSE"}
			/> */}
		</div>
	);
}
