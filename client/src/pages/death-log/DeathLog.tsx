import { useDeathLogStore } from "../../stores/useDeathLogStore";
import NavBar from "../../components/navBar/NavBar";
import React, { forwardRef, useRef, useState } from "react";
import DeathLogFAB from "./DeathLogFAB";
import { Virtuoso, type Components, type VirtuosoHandle } from "react-virtuoso";
import DeathLogBreadcrumb from "./DeathLogBreadcrumb";
import useBreadcrumbMembers from "./useBreadcrumbMembers";
import DeathLogCard from "./card/DeathLogCard";
import DeathLogCardWrapper from "./card/DeathLogCardWrapper";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";

export default function DeathLog({ parent }: { parent: DistinctTreeNode }) {
	const childIDS = parent.childIDS;
	const virtuosoRef = useRef<VirtuosoHandle>(null);

	const [pageOpacity, setPageOpacity] = useState("");
	const [deathLogIsInert, setDeathLogIsInert] = useState(false);
	const breadcrumbMembers = useBreadcrumbMembers();

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

	function determineFABType(): Exclude<
		DistinctTreeNode["type"],
		"ROOT_NODE"
	> {
		switch (parent.type) {
			case "ROOT_NODE":
				return "game";
			case "game":
				return "profile";
			default:
				return "subject";
		}
	}

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
				data={childIDS}
				itemContent={(i, id) => (
					<DeathLogCardWrapper nodeID={id} entryNum={i + 1} />
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
				type={determineFABType()}
				parentID={parent.id}
				handleFabOnFocus={() => {
					setPageOpacity("opacity-25");
					setDeathLogIsInert(true);
				}}
				handleFabOnBlur={() => {
					setPageOpacity("");
					setDeathLogIsInert(false);
				}}
			/>
		</>
	);
}
