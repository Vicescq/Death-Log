import { useEffect, useMemo } from "react";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import NavBar from "../../components/navBar/NavBar";
import DeathLogCard from "./DeathLogCard";
import { assertIsDistinctTreeNode, assertIsNonNull } from "../../utils";
import React from "react";
import DeathLogFAB from "./DeathLogFAB";

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
	const bothArr: React.JSX.Element[] = [];
	nodes.forEach((node, i) => {
		bothArr.push(
			<DeathLogCard node={node} key={node.id} entryNum={i + 1} />,
		);
		if (i % 2 == 0) {
			evenArr.push(
				<DeathLogCard node={node} key={node.id + i} entryNum={i + 1} />,
			);
		} else {
			oddArr.push(
				<DeathLogCard
					node={node}
					key={node.id + i + 1}
					entryNum={i + 1}
				/>,
			);
		}
	});

	// better UX for 1 death log element
	const vwOddCSS = bothArr.length == 1 ? "w-[0vw]" : "w-[40vw]";

	// const cards = useMemo(() => {
	// 	return childIDS.map((nodeID) => <Card key={nodeID} id={nodeID} />);
	// }, [childIDS, parentID]);

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
			<DeathLogFAB type={type}/>
		</>
	);
}
