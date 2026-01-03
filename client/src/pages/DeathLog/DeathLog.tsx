import { useEffect, useRef, useState } from "react";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import NavBar from "../../components/navBar/NavBar";
import DeathLogCard from "./DeathLogCard";
import { assertIsDistinctTreeNode, assertIsNonNull } from "../../utils";
import React from "react";
import DeathLogFAB from "./DeathLogFAB";
import Modal from "../../components/Modal";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import DeathLogModalEditBody from "./Modal/DeathLogModalEditBody";

type Props = {
	type: "game" | "profile" | "subject";
	parentID: string;
};

export default function DeathLog({ type, parentID }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const editModalRef = useRef<HTMLDialogElement>(null);

	const [currModalNode, setCurrModalNode] = useState<DistinctTreeNode>({
		id: "__PLACEHOLDER__",
		childIDS: [],
		completed: false,
		dateStart: "Placeholder",
		dateEnd: "Placeholder",
		type: "game",
		name: "Placeholder",
		notes: "",
		parentID: "__PLACEHOLDER",
		totalDeaths: 0,
	});

	const childIDS = tree.get(parentID)?.childIDS || [];
	const nodes = childIDS.map((nodeID) => {
		// for typscript auto complete
		const node = tree.get(nodeID);
		assertIsNonNull(node);
		assertIsDistinctTreeNode(node);
		return node;
	});

	const evenArr: React.JSX.Element[] = [];
	const oddArr: React.JSX.Element[] = [];
	const bothArr: React.JSX.Element[] = [];
	nodes.forEach((node, i) => {
		bothArr.push(
			<DeathLogCard
				node={node}
				key={node.id}
				entryNum={i + 1}
				handleEdit={() => {
					setCurrModalNode(node);
					editModalRef.current?.showModal();
				}}
			/>,
		);
		if (i % 2 == 0) {
			evenArr.push(
				<DeathLogCard
					node={node}
					key={node.id + i}
					entryNum={i + 1}
					handleEdit={() => {
						setCurrModalNode(node);
						editModalRef.current?.showModal();
					}}
				/>,
			);
		} else {
			oddArr.push(
				<DeathLogCard
					node={node}
					key={node.id + i + 1}
					entryNum={i + 1}
					handleEdit={() => {
						setCurrModalNode(node);
						editModalRef.current?.showModal();
					}}
				/>,
			);
		}
	});

	// better UX for 1 death log element
	const vwOddCSS = bothArr.length == 1 ? "w-[0vw]" : "w-[40vw]";

	return (
		<>
			<NavBar />
			<div className="my-6 mb-14 flex justify-center">
				<ul className="list bg-base-100 rounded-box flex w-screen lg:hidden">
					{bothArr}
				</ul>
				<ul className="list bg-base-100 rounded-box hidden lg:flex lg:w-[40vw]">
					{evenArr}
				</ul>
				<ul
					className={`list bg-base-100 rounded-box hidden lg:flex lg:${vwOddCSS}`}
				>
					{oddArr}
				</ul>
			</div>
			<DeathLogFAB type={type} parentID={parentID} />
			<Modal
				closeBtnName="Close"
				content={
					<DeathLogModalEditBody currModalNode={currModalNode} />
				}
				header="View & Edit Entry"
				ref={editModalRef}
				modalBtns={[]}
			/>
		</>
	);
}
