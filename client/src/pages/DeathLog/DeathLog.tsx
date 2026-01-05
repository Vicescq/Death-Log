import { useDeathLogStore } from "../../stores/useDeathLogStore";
import NavBar from "../../components/navBar/NavBar";
import DeathLogCard from "./Card/DeathLogCard";
import { assertIsDistinctTreeNode, assertIsNonNull } from "../../utils";
import React, { useState } from "react";
import DeathLogFAB from "./DeathLogFAB";
import usePagination from "../../hooks/usePagination";
import * as Utils from "./utils";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import { Virtuoso } from "react-virtuoso";

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

	const maxItemPerPage = 30;
	const maxPage = Utils.calcRequiredPages(nodes.length, maxItemPerPage);
	const { page, handlePageState, handlePageTurn } = usePagination(maxPage);

	// const paginatedCards: React.JSX.Element[][] = [];
	// let cards: React.JSX.Element[] = [];
	// nodes.forEach((node, i) => {
	// 	cards.push(<DeathLogCard node={node} key={node.id} entryNum={i + 1} />);
	// });
	// Utils.paginateCardArray(paginatedCards, cards, maxPage, maxItemPerPage);

	let cards: React.JSX.Element[] = [];
	nodes.forEach((node, i) => {
		cards.push(<DeathLogCard node={node} key={node.id} entryNum={i + 1} />);
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
			<NavBar
				midNavContent={
					<div className="join flex">
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
				}
			/>

			{/* <ul
				className={`list rounded-box my-6 mb-14 ${pageOpacity}`}
				inert={deathLogIsInert}
			>
				{paginatedCards[page-1]}
				{cards}
			</ul> */}

			<Virtuoso
				data={nodes}
				itemContent={(i, node) => (
					<DeathLogCard node={node} key={node.id} entryNum={i + 1} />
				)}
				className={`!h-[85vh] list rounded-box my-6 ${pageOpacity}`}
			/>

			<DeathLogFAB
				type={type}
				parentID={parentID}
				handleFabOnFocus={handleFabOnFocus}
				handleFabOnBlur={handleFabOnBlur}
			/>
		</>
	);
}
