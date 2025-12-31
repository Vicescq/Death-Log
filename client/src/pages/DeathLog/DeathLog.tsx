import { useMemo } from "react";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import NavBar from "../../components/navBar/NavBar";
import DeathLogCard from "./DeathLogCard";
import { assertIsDistinctTreeNode, assertIsNonNull } from "../../utils";
import React from "react";
import DeathLogCardOptions from "./DeathLogCardOptions";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";

type Props = {
	type: "game" | "profile" | "subject";
	parentID: string;
};

export default function DeathLog({ type, parentID }: Props) {
	const tree = useDeathLogStore((state) => state.tree);

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
	const x: DistinctTreeNode[] = [];
	nodes.forEach((node, i) => {
		if (i % 2 == 0) {
			x.push(node);
			evenArr.push(
				<DeathLogCard node={node} key={node.id} entryNum={i + 1} />,
			);
		} else {
			oddArr.push(
				<DeathLogCard node={node} key={node.id} entryNum={i + 1} />,
			);
		}
	});

	// const cards = useMemo(() => {
	// 	return childIDS.map((nodeID) => <Card key={nodeID} id={nodeID} />);
	// }, [childIDS, parentID]);

	return (
		<>
			<NavBar />
			<div className="my-8 flex justify-center">
				<ul className="list bg-base-100 rounded-box w-screen sm:w-screen lg:w-[40vw]">
					{evenArr}
				</ul>
				<ul className="list bg-base-100 rounded-box hidden lg:flex lg:w-[40vw]">
					{oddArr}
				</ul>
			</div>
		</>
	);
}
