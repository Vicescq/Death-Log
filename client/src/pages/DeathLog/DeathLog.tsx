import { useDeathLogStore } from "../../stores/useDeathLogStore";
import NavBar from "../../components/navBar/NavBar";
import DeathLogCard from "./Card/DeathLogCard";
import { assertIsDistinctTreeNode, assertIsNonNull } from "../../utils";
import React, { useState } from "react";
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

	let bothArr: React.JSX.Element[] = [];
	nodes.forEach((node, i) => {
		bothArr.push(
			<DeathLogCard node={node} key={node.id} entryNum={i + 1} />,
		);
	});

	const [pageOpacity, setPageOpacity] = useState("");
	const [deathLogIsInert, setDeathLogIsInert] = useState(false);

	function handleFabOnFocus() {
		setPageOpacity("opacity-25");
		setDeathLogIsInert(true);
	}

	function handleFabOnBlur() {
		setPageOpacity("");
		setDeathLogIsInert(false);
	}

	return (
		<>
			<NavBar isDL={true} />
			<ul
				className={`list bg-base-100 rounded-box my-6 mb-14 flex ${pageOpacity}`}
				inert={deathLogIsInert}
			>
				{bothArr}
			</ul>
			<DeathLogFAB
				type={type}
				parentID={parentID}
				handleFabOnFocus={handleFabOnFocus}
				handleFabOnBlur={handleFabOnBlur}
			/>
		</>
	);
}
