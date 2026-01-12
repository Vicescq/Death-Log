import { useDeathLogStore } from "../../stores/useDeathLogStore";
import NavBar from "../../components/navBar/NavBar";
import DeathLogCard from "./card/DeathLogCard";
import { assertIsDistinctTreeNode, assertIsNonNull } from "../../utils";
import React, { forwardRef, useRef, useState } from "react";
import DeathLogFAB from "./DeathLogFAB";
import usePagination from "../../hooks/usePagination";
import * as Utils from "./utils";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import { Virtuoso, type Components, type VirtuosoHandle } from "react-virtuoso";
import DeathLogBreadcrumb from "./DeathLogBreadcrumb";
import useBreadcrumbMembers from "./useBreadcrumbMembers";

type Props = {
	type: "game" | "profile" | "subject";
	parentID: string;
};

export default function DeathLog({ type, parentID }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const virtuosoRef = useRef<VirtuosoHandle>(null);

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
		cards.push(<DeathLogCard node={node} entryNum={i + 1} />);
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

	const breadcrumbMembers = useBreadcrumbMembers();

	const DeathLogCardWrapper: Components["List"] = forwardRef((props, ref) => {
		return (
			<ul
				ref={ref as React.Ref<HTMLUListElement>} // no other workaround ?
				{...props}
				className={`list rounded-box max-w-[900px] m-auto ${pageOpacity}`}
				inert={deathLogIsInert}
			>
				{props.children}
			</ul>
		);
	});

	return (
		<>
			<NavBar
				midNavContent={<></>}
				endNavContent={
					<DeathLogBreadcrumb breadcrumbMembers={breadcrumbMembers} />
				}
				endNavContentCSS="mr-0.5 w-[60%]"
				startNavContentCSS="w-[40%]"
			/>

			<Virtuoso
				ref={virtuosoRef}
				data={nodes}
				itemContent={(i, node) => (
					<DeathLogCard node={node} entryNum={i + 1} />
				)}
				className={``}
				components={{ List: DeathLogCardWrapper }}
				computeItemKey={(_, node) => {
					return node.id;
				}}
				useWindowScroll
			/>

			<footer className="mb-14"></footer>

			<DeathLogFAB
				virtuosoRef={virtuosoRef}
				type={type}
				parentID={parentID}
				handleFabOnFocus={handleFabOnFocus}
				handleFabOnBlur={handleFabOnBlur}
			/>
		</>
	);
}
