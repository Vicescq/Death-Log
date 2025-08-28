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
} from "./utils";
import { useTreeStore } from "../../hooks/StateManagers/useTreeStore";
import Modal from "../modal/Modal";

export default function Card({ id }: { id: string }) {
	let navigate = useNavigate();

	const node = useTreeStore((state) =>
		state.tree.get(id),
	) as DistinctTreeNode;
	if (node == undefined) {
		throw new Error(
			"DEV ERROR! INCORRECTLY PASSED IN ROOT NODE OR UNDEFINED NODE TO A CARD",
		);
	}
	const updateNode = useTreeStore((state) => state.updateNode);

	const mainPageTransitionState = createCardMainPageTransitionState(node);
	const { cardCSS, settersCSS, highlightingCSS, reoccurringCSS } =
		createCardCSS(node);

	let deathCount = 0;
	switch (node.type) {
		case "game":
			deathCount = node.totalDeaths;
			break;
		case "profile":
			deathCount = node.deathEntries.length;
			break;
		case "subject":
			deathCount = node.deaths;
	}

	// useConsoleLogOnStateChange(modalState, "MODAL STATE", modalState);

	return (
		<div
			className={`flex border-4 border-black font-semibold ${cardCSS} h-60 w-60 rounded-xl p-2 shadow-[10px_8px_0px_rgba(0,0,0,1)] duration-200 ease-in-out hover:shadow-[20px_10px_0px_rgba(0,0,0,1)]`}
		>
			<div className="flex w-40 flex-col">
				<div className="bg-indianred flex gap-1 rounded-2xl border-2 border-black p-1 px-3 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
					<img className="w-9" src={skull} alt="" />
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
					onClick={() => 1}
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
			{/* <Modal
				modalStyle={"alert"}
				body={undefined}
				modalRef={undefined}
				negativeFn={function (): void {
					throw new Error("Function not implemented.");
				}}
				negativeFnBtnLabel={"CANCEL"}
			/> */}
		</div>
	);
}
