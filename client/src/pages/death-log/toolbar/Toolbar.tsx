import add from "../../../assets/add.svg";
import filter from "../../../assets/filter.svg";
import sort from "../../../assets/sort.svg";
import search from "../../../assets/search.svg";
import returnIcon from "../../../assets/return.svg";
import { useState, useRef, useEffect } from "react";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";
import { assertIsNonNull } from "../../../utils/asserts";
import {
	createNodeFormAddSchema,
	FiltersSchema,
	SortSchema,
	type Filters,
	type NodeFormAdd,
	type SortSettings,
} from "../../../model/formSchemas";
import ToolbarAdd from "./ToolbarAdd";
import Modal from "../../../components/Modal";
import ToolbarFilter from "./ToolbarFilter";
import ToolbarSort from "./ToolbarSort";
import { getDeathlogViewType } from "../utils";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { CONSTANTS } from "../../../../shared/constants";
import { Z_INDICES } from "../../../../shared/z-indices";

type Props = {
	parent: DistinctTreeNode;
	filters: Filters;
	defaultFilters: Filters;
	sortSettings: SortSettings;
	defaultSortSettings: SortSettings;
	onFilterChange: (newFilters: Filters) => void;
	onSortChange: (newSortSettings: SortSettings) => void;
	searchQuery: string;
	onSearch: (query: string) => void;
};

export default function Toolbar({
	parent,
	filters,
	defaultFilters,
	sortSettings,
	defaultSortSettings,
	onFilterChange,
	onSortChange,
	searchQuery,
	onSearch,
}: Props) {
	const addNode = useDeathLogStore((state) => state.addNode);
	const [modalType, setModalType] = useState<"add" | "filter" | "sort">(
		"add",
	);
	const modalRef = useRef<HTMLDialogElement>(null);

	const tree = useDeathLogStore((state) => state.tree);
	const siblingNames = parent.childIDS.map((id) => {
		const node = tree.get(id);
		assertIsNonNull(node);
		return node.name;
	});

	const type = getDeathlogViewType(parent);

	const nodeFormAddSchema = createNodeFormAddSchema(siblingNames, null);

	const addForm = useForm<NodeFormAdd>({
		defaultValues: {
			name: "",
			context: "Boss",
			reoccurring: false,
		},
		mode: "onChange",
		resolver: zodResolver(nodeFormAddSchema),
	});

	const onAdd: SubmitHandler<NodeFormAdd> = (formData) => {
		if (type != "subject") {
			addNode(type, formData.name, parent.id);
		} else {
			const context = formData.context;
			addNode(type, formData.name, parent.id, {
				context: context,
				reoccurring: formData.reoccurring,
			});
		}
		modalRef.current?.close();
	};

	const [pressedFilterConfirm, setPressedFilterConfirm] = useState(false);

	const filterForm = useForm<Filters>({
		defaultValues: filters,
		mode: "onChange",
		resolver: zodResolver(FiltersSchema),
	});

	const onFilter: SubmitHandler<Filters> = (formData) => {
		onFilterChange(formData);
		modalRef.current?.close();
		setPressedFilterConfirm(true);
		filterForm.reset(formData);
	};

	const [pressedSortConfirm, setPressedSortConfirm] = useState(false);
	const sortForm = useForm<SortSettings>({
		defaultValues: sortSettings,
		mode: "onChange",
		resolver: zodResolver(SortSchema),
	});

	const onSort: SubmitHandler<SortSettings> = (formData) => {
		onSortChange(formData);
		modalRef.current?.close();
		setPressedSortConfirm(true);
		sortForm.reset(formData);
	};

	const header =
		modalType == "add"
			? "Add " + type[0].toUpperCase() + type.slice(1)
			: modalType == "filter"
				? "Filter options"
				: "Sort options";

	const nonCustomFilters = Object.keys(defaultFilters).every((key) => {
		if (
			((key as keyof Filters) == "dateFrom" ||
				(key as keyof Filters) == "dateTo") &&
			!filters["dateRangeEnabled"]
		) {
			return true;
		} else {
			return (
				filters[key as keyof Filters] ===
				defaultFilters[key as keyof Filters]
			);
		}
	});

	const nonCustomSort = Object.keys(defaultSortSettings).every(
		(key) =>
			sortSettings[key as keyof SortSettings] ===
			defaultSortSettings[key as keyof SortSettings],
	);

	const [clickedSearchIcon, setClickedSearchIcon] = useState(false);
	const mdBreakpoint = "(width >= 700px)";
	useMediaQuery(mdBreakpoint, () => setClickedSearchIcon(false));
	const searchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (clickedSearchIcon) {
			searchRef.current?.focus();
		} else {
			searchRef.current?.blur();
		}
	}, [clickedSearchIcon]);

	return (
		<>
			<div
				className={`fixed bottom-4 left-1/2 w-max -translate-x-1/2 ${Z_INDICES.TOOLBAR_FAB}`}
			>
				<ul className="menu menu-xs menu-horizontal bg-neutral rounded-box gap-1">
					<li>
						<button
							onClick={() => {
								if (clickedSearchIcon) {
									setClickedSearchIcon(false);
								} else {
									setModalType("add");
									modalRef.current?.showModal();
								}
							}}
							className="btn btn-neutral"
							aria-label={
								clickedSearchIcon
									? CONSTANTS.TOOLBAR.EXIT_SEARCH_ARIA
									: CONSTANTS.TOOLBAR.ADD_BTN_ARIA
							}
						>
							<img
								src={clickedSearchIcon ? returnIcon : add}
								alt=""
							/>
						</button>
					</li>
					<div className="divider divider-horizontal mx-0.5"></div>

					<li
						className={
							clickedSearchIcon ? "hidden" : "block md:hidden"
						}
					>
						<button
							className={`btn ${searchQuery == "" ? "btn-neutral" : ""}`}
							onClick={() => setClickedSearchIcon(true)}
							aria-label={CONSTANTS.TOOLBAR.SEARCH_BTN_ARIA}
						>
							<img src={search} alt="" />
						</button>
					</li>
					<li
						className={
							clickedSearchIcon ? "" : "hidden md:block md:w-max"
						}
					>
						<input
							ref={searchRef}
							type="text"
							className="input text-lg"
							placeholder={CONSTANTS.TOOLBAR.SEARCH_PH}
							value={searchQuery}
							onChange={(e) => onSearch(e.currentTarget.value)}
							onKeyDown={(e) =>
								e.key == "Escape"
									? setClickedSearchIcon(false)
									: null
							}
						/>
					</li>

					{!clickedSearchIcon ? (
						<>
							<li>
								<button
									onClick={() => {
										setModalType("filter");
										modalRef.current?.showModal();
									}}
									className={`btn ${nonCustomFilters ? "btn-neutral" : ""}`}
									aria-label={
										CONSTANTS.TOOLBAR.FILTER_BTN_ARIA
									}
								>
									<img src={filter} alt="" />
								</button>
							</li>
							<li>
								<button
									className={`btn ${nonCustomSort ? "btn-neutral" : ""}`}
									onClick={() => {
										setModalType("sort");
										modalRef.current?.showModal();
									}}
									aria-label={CONSTANTS.TOOLBAR.SORT_BTN_ARIA}
								>
									<img src={sort} alt="" />
								</button>
							</li>
						</>
					) : null}
				</ul>
			</div>
			<Modal
				ref={modalRef}
				header={header}
				content={
					modalType == "add" ? (
						<ToolbarAdd type={type} form={addForm} onAdd={onAdd} />
					) : modalType == "filter" ? (
						<ToolbarFilter
							form={filterForm}
							nodeType={type}
							onFilter={onFilter}
							onReset={() => {
								onFilterChange(defaultFilters);
								filterForm.reset(defaultFilters);
								modalRef.current?.close();
							}}
						/>
					) : (
						<ToolbarSort
							form={sortForm}
							onReset={() => {
								onSortChange(defaultSortSettings);
								sortForm.reset(defaultSortSettings);
								modalRef.current?.close();
							}}
							onSort={onSort}
							nodeType={type}
						/>
					)
				}
				closeBtnName="Cancel"
				onClose={() => {
					addForm.reset();

					// resets to what it once before, rather than straight up default
					if (!pressedFilterConfirm) {
						filterForm.reset();
					}
					if (!pressedSortConfirm) {
						sortForm.reset();
					}

					setPressedFilterConfirm(false);
					setPressedSortConfirm(false);
				}}
			/>
		</>
	);
}
