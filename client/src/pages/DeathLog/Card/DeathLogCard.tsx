import Modal from "../../../components/Modal";
import DeathLogCardOptions from "./DeathLogCardOptions";
import usePagination from "../../../hooks/usePagination";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import loop from "../../../assets/loop.svg";
import skullRed from "../../../assets/skull_red.svg";
import * as Utils from "../utils";
import * as GenUtils from "../../../utils";
import DeathLogCardModalBody from "./DeathLogCardModalBody";
import useCardCompletionToggle from "./useCardCompletionToggle";
import useCardModal from "./useCardModal";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";

type Props = {
	node: DistinctTreeNode;
	entryNum: number;
};

export default function DeathLogCard({ node, entryNum }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);

	const { page, setPage, handlePageTurn } = usePagination(
		node.type == "game" ? 2 : 3,
	);

	const {
		modalState,
		setModalState,
		inputTextNameError,
		setInputTextNameError,
		editModalRef,
		inputTextProfileGroupError,
		setInputTextProfileGroupError,
	} = useCardModal(node);

	const {
		completionNotifyModalRef,
		checked,
		setChecked,
		completedCSSStrike,
	} = useCardCompletionToggle(node.completed);

	return (
		<>
			<li
				className={`list-row hover:bg-neutral rounded-none`}
				inert={false}
			>
				<div className="flex items-center justify-center">
					<span className="text-accent line-clamp-1 w-8 text-xs">
						{entryNum}
					</span>
					<div>
						{node.type == "subject" && node.reoccurring ? (
							<img src={loop} alt="" className="w-6" />
						) : (
							<input
								type="checkbox"
								checked={checked}
								className="checkbox checkbox-sm checkbox-success"
								onChange={() =>
									completionNotifyModalRef.current?.showModal()
								}
							/>
						)}
					</div>
				</div>
				<div
					className={`flex flex-col justify-center ${completedCSSStrike}`}
				>
					<div className="line-clamp-4 sm:line-clamp-2">
						{node.name}
					</div>
					<div className="flex gap-2 font-semibold uppercase opacity-60">
						<img src={skullRed} alt="" className="w-4" />
						{Utils.calcDeaths(node, tree)}
					</div>
				</div>
				<DeathLogCardOptions
					node={node}
					handleEdit={() => editModalRef.current?.showModal()}
				/>
				<Modal
					closeBtnName="Cancel"
					content={
						<>
							<DeathLogCardModalBody
								page={page}
								handleOnEditChange={(newModalState) =>
									setModalState(newModalState)
								}
								inputTextNameError={inputTextNameError}
								modalState={modalState}
							/>

							<div className="join mt-4 flex">
								<button
									className="join-item btn"
									onClick={() => {
										handlePageTurn(false);
									}}
								>
									«
								</button>
								<button className="join-item btn flex-1">
									Page {page}
								</button>
								<button
									className="join-item btn"
									onClick={() => {
										handlePageTurn(true);
									}}
								>
									»
								</button>
							</div>
						</>
					}
					header="View & Edit Entry"
					ref={editModalRef}
					modalBtns={[
						{
							text: "Save edits",
							css: `${
								Utils.cardHasBeenEdited(node, modalState)
									? "btn-success"
									: "btn-disabled"
							} mt-10`,
							fn: () => {
								try {
									updateNode(node, modalState);
									editModalRef.current?.close();
								} catch (e) {
									if (e instanceof Error) {
										setInputTextNameError(e.message);
										console.log(e.message)
									}
								}
							},
						},
					]}
					handleOnClose={async () => {
						await GenUtils.delay(300); // if not used, ui flicker from page turn happens
						setPage(1);
						setModalState(node);
						setInputTextNameError("");
					}}
				/>
				<Modal
					closeBtnName="Cancel"
					content={<></>}
					ref={completionNotifyModalRef}
					header={`Do you want to mark this as ${!checked ? "complete?" : "incomplete?"}`}
					modalBtns={[
						{
							text: "Confirm",
							css: "btn-success",
							fn: async () => {
								completionNotifyModalRef.current?.close();
								await GenUtils.delay(300);
								const newChecked = !checked;
								if (newChecked) {
									updateNode(node, {
										...node,
										completed: newChecked,
										dateEnd: new Date().toISOString(),
									});
								} else {
									updateNode(node, {
										...node,
										completed: newChecked,
										dateEnd: null,
									});
								}
								setChecked(newChecked);
							},
						},
					]}
				/>
			</li>
		</>
	);
}
