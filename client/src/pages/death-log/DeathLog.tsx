import NavBar from "../../components/navBar/NavBar";
import React, { forwardRef, useRef, useState } from "react";
import DeathLogFAB from "./fab/DeathLogFAB";
import { Virtuoso, type Components, type VirtuosoHandle } from "react-virtuoso";
import DeathLogBreadcrumb from "./DeathLogBreadcrumb";
import DeathLogCardWrapper from "./card/DeathLogCardWrapper";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import { determineFABType, sortChildIDS } from "./utils";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { assertIsNonNull } from "../../utils";
import Modal from "../../components/Modal";
import DeathLogCardModalBody from "./modal/DeathLogCardModalBody";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";

export default function DeathLog({ parent }: { parent: DistinctTreeNode }) {
	const tree = useDeathLogStore((state) => state.tree);
	const virtuosoRef = useRef<VirtuosoHandle>(null);
	const modalRef = useRef<HTMLDialogElement>(null);

	const [pageOpacity, setPageOpacity] = useState("");
	const [deathLogIsInert, setDeathLogIsInert] = useState(false);

	const [modalBodyType, setModalBodyType] = useState<"edit" | "completion">(
		"edit",
	);
	const [focusedNode, setFocusedNode] = useState<DistinctTreeNode | null>(
		null,
	);

	const DeathLogWrapper: Components["List"] = forwardRef((props, ref) => {
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
	});

	const sortedChildIDs = sortChildIDS(parent, tree);
	const nodeNames = parent.childIDS.map((id) => {
		const node = tree.get(id);
		assertIsNonNull(node);
		return node.name;
	});

	useConsoleLogOnStateChange(focusedNode, focusedNode);
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
				itemContent={(i, id) => (
					<DeathLogCardWrapper
						nodeID={id}
						entryNum={i + 1}
						onOpenCompletionModal={() => {
							setModalBodyType("completion");
							modalRef.current?.showModal();
						}}
						onOpenEditModal={() => {
							setModalBodyType("edit");
							modalRef.current?.showModal();
						}}
						onFocus={(node) => setFocusedNode(node)}
					/>
				)}
				components={{ List: DeathLogWrapper }}
				computeItemKey={(_, id) => {
					return id;
				}}
				useWindowScroll
			/>

			<footer className="mb-14"></footer>

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
				siblingNames={nodeNames}
			/>

			<Modal
				ref={modalRef}
				header={
					modalBodyType == "edit"
						? "View & Edit Entry"
						: "Completion Toggle"
				}
				content={
					<DeathLogCardModalBody
						type={modalBodyType}
						page={1}
						node={focusedNode}
					/>
				}
				closeBtnName="Close"
				modalBtns={[]}
			/>
		</>
	);
}
