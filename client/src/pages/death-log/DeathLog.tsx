import NavBar from "../../components/navBar/NavBar";
import React, { forwardRef, useRef, useState } from "react";
import DeathLogFAB from "./fab/DeathLogFAB";
import { Virtuoso, type Components, type VirtuosoHandle } from "react-virtuoso";
import DeathLogBreadcrumb from "./breadcrumb/DeathLogBreadcrumb";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import { determineFABType, sortChildIDS } from "./utils/utils";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { assertIsNonNull } from "../../utils";
import Modal from "../../components/Modal";
import DeathLogCard from "./card/DeathLogCard";

export default function DeathLog({ parent }: { parent: DistinctTreeNode }) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const virtuosoRef = useRef<VirtuosoHandle>(null);
	const modalRef = useRef<HTMLDialogElement>(null);

	const [pageOpacity, setPageOpacity] = useState("");
	const [deathLogIsInert, setDeathLogIsInert] = useState(false);

	const [focusedNode, setFocusedNode] = useState<DistinctTreeNode | null>(
		null,
	);

	const DeathLogCardListWrapper: Components["List"] = forwardRef(
		(props, ref) => {
			return (
				<ul
					ref={ref as React.Ref<HTMLUListElement>} // no other workaround ?
					{...props}
					className={`list rounded-box m-auto max-w-[900px] ${pageOpacity}`}
					inert={deathLogIsInert}
				>
					{props.children}
				</ul>
			);
		},
	);

	function handleNodeCompletion(nodeToBeUpdated: DistinctTreeNode) {
		let updatedNode: DistinctTreeNode;
		if (nodeToBeUpdated.completed) {
			updatedNode = {
				...nodeToBeUpdated,
				completed: !nodeToBeUpdated.completed,
				dateEnd: null,
			};
		} else {
			updatedNode = {
				...nodeToBeUpdated,
				completed: !nodeToBeUpdated.completed,
				dateEnd: new Date().toISOString(),
			};
		}

		updateNode(updatedNode);
		modalRef.current?.close();
	}

	const sortedChildIDs = sortChildIDS(parent, tree);

	return (
		<>
			<NavBar
				midNavContent={<></>}
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>

			<Virtuoso
				ref={virtuosoRef}
				data={sortedChildIDs}
				itemContent={(i, id) => {
					const node = tree.get(id);
					assertIsNonNull(node);
					return (
						<DeathLogCard
							node={node}
							tree={tree}
							entryNum={i + 1}
							onOpenCompletionModal={() => {
								setFocusedNode(node);
								modalRef.current?.showModal();
							}}
						/>
					);
				}}
				components={{ List: DeathLogCardListWrapper }}
				computeItemKey={(_, id) => {
					return id;
				}}
				useWindowScroll
			/>

			<DeathLogFAB
				virtuosoRef={virtuosoRef}
				type={determineFABType(parent)}
				parentID={parent.id}
				onFocus={() => {
					setPageOpacity("opacity-25");
					setDeathLogIsInert(true);
				}}
				onBlur={() => {
					setPageOpacity("");
					setDeathLogIsInert(false);
				}}
			/>

			<Modal
				ref={modalRef}
				header={"Completion Status"}
				content={
					<div className="mt-4 mb-2">
						Do you want to mark this as{" "}
						{focusedNode?.completed ? "incomplete?" : "complete?"}
						<button
							className="btn btn-secondary mt-2 w-full"
							onClick={() => {
								assertIsNonNull(focusedNode);
								handleNodeCompletion(focusedNode);
							}}
						>
							Confirm
						</button>
					</div>
				}
				closeBtnName="Cancel"
				modalBtns={[]}
			/>

			<footer className="mb-14"></footer>
		</>
	);
}
