import NavBar from "../../components/nav-bar/NavBar";
import React, { forwardRef, useRef, useState } from "react";
import { Virtuoso, type Components, type VirtuosoHandle } from "react-virtuoso";
import Breadcrumb from "./breadcrumb/Breadcrumb";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { assertIsNonNull } from "../../utils/asserts";
import Modal from "../../components/Modal";
import Card from "./card/Card";
import type { DistinctTreeNode } from "../../model/tree-node-model/TreeNodeSchema";
import Toolbar from "./toolbar/Toolbar";
import LocalDB from "../../services/LocalDB";
import type { Filters, SortSettings } from "../../model/formSchemas";
import { filter, getDeathlogViewType, sort } from "./utils";
import { defaultFilters, defaultSortSettings } from "../../../shared/defaults";
import { CONSTANTS } from "../../../shared/constants";
import EmptyLogDemo from "./EmptyLogDemo";
import FAQSuggest from "./FAQSuggest";

export default function DeathLog({ parent }: { parent: DistinctTreeNode }) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const virtuosoRef = useRef<VirtuosoHandle>(null);
	const modalRef = useRef<HTMLDialogElement>(null);

	const [focusedNode, setFocusedNode] = useState<DistinctTreeNode | null>(
		null,
	);

	const DeathLogCardListWrapper: Components["List"] = forwardRef(
		(props, ref) => {
			return (
				<ul
					ref={ref as React.Ref<HTMLUListElement>} // no other workaround ?
					{...props}
					className={`list rounded-box m-auto max-w-225`}
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

	const pageViewType = getDeathlogViewType(parent);
	const [filters, setFilters] = useState<Filters>(
		LocalDB.getDLFilterPrefs(pageViewType, defaultFilters),
	);
	const [sortSettings, setSortSettings] = useState<SortSettings>(
		LocalDB.getDLSortPrefs(pageViewType, defaultSortSettings),
	);

	const [searchQuery, setSearchQuery] = useState("");

	const ids = sort(
		filter(
			parent.childIDS,
			filters,
			tree,
			searchQuery,
			parent.type === "profile" ? parent.groupings : [],
		),
		tree,
		sortSettings,
	);

	return (
		<>
			<NavBar
				midNavContent={<></>}
				endNavContent={<Breadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>

			{tree.size === 1 ? (
				<div className="flex min-h-[75vh] flex-col items-center justify-center gap-12">
					<FAQSuggest />
					<EmptyLogDemo />
				</div>
			) : (
				<Virtuoso
					ref={virtuosoRef}
					data={ids}
					itemContent={(i, id) => {
						const node = tree.get(id);
						assertIsNonNull(node);
						return (
							<Card
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
			)}

			<Toolbar
				parent={parent}
				filters={filters}
				defaultFilters={defaultFilters}
				sortSettings={sortSettings}
				defaultSortSettings={defaultSortSettings}
				onFilterChange={(newFilters) => {
					setFilters(newFilters);
					LocalDB.setDLFilterPrefs(
						newFilters,
						pageViewType,
						defaultFilters,
					);
				}}
				onSortChange={(newSortSettings) => {
					setSortSettings(newSortSettings);
					LocalDB.setDLSortPrefs(
						newSortSettings,
						pageViewType,
						defaultSortSettings,
					);
				}}
				searchQuery={searchQuery}
				onSearch={(query) => setSearchQuery(query)}
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
							{CONSTANTS.DEATH_LOG_CARD.COMPLETION_CONFIRM}
						</button>
					</div>
				}
				closeBtnName={CONSTANTS.DEATH_LOG_CARD.COMPLETION_CANCEL}
			/>

			<footer className="mb-14"></footer>
		</>
	);
}
