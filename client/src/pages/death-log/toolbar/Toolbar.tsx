import add from "../../../assets/add.svg";
import filter from "../../../assets/filter.svg";
import sort from "../../../assets/sort.svg";
import search from "../../../assets/search.svg";
import { useState, useRef } from "react";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";
import { assertIsNonNull } from "../../../utils/asserts";
import { createNodeFormAddSchema, type NodeFormAdd } from "../formSchemas";
import type { VirtuosoHandle } from "react-virtuoso";
import ToolbarAdd from "./ToolbarAdd";
import Modal from "../../../components/Modal";
import ToolbarFilter from "./ToolbarFilter";

type Props = {
	onFocus: () => void;
	onBlur: () => void;
	virtuosoRef: React.RefObject<VirtuosoHandle | null>;
	parent: DistinctTreeNode;
};

export default function Toolbar({
	onFocus,
	onBlur,
	virtuosoRef,
	parent,
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

	let type: Exclude<DistinctTreeNode["type"], "ROOT_NODE">;
	switch (parent.type) {
		case "ROOT_NODE":
			type = "game";
			break;
		case "game":
			type = "profile";
			break;
		default:
			type = "subject";
	}

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

	const header =
		modalType == "add"
			? "Add " + type[0].toUpperCase() + type.slice(1)
			: modalType == "filter"
				? "Filter options"
				: "Sort options";
	return (
		<>
			<div className="fixed bottom-4 left-1/2 z-5 w-max -translate-x-1/2">
				<ul className="menu menu-xs menu-horizontal bg-neutral rounded-box">
					<li>
						<button
							onClick={() => {
								setModalType("add");
								modalRef.current?.showModal();
							}}
							className="btn btn-neutral"
						>
							<img src={add} alt="" />
						</button>
					</li>
					<div className="divider divider-horizontal mx-0.5"></div>
					<li>
						<button className="btn btn-neutral">
							<img src={search} alt="" />
						</button>
					</li>
					<li>
						<button
							onClick={() => {
								setModalType("filter");
								modalRef.current?.showModal();
							}}
							className="btn btn-neutral"
						>
							<img src={filter} alt="" />
						</button>
					</li>
					<li>
						<button className="btn btn-neutral">
							<img src={sort} alt="" />
						</button>
					</li>
				</ul>
			</div>
			<Modal
				ref={modalRef}
				header={header}
				content={
					modalType == "add" ? (
						<ToolbarAdd type={type} form={addForm} onAdd={onAdd} />
					) : (
						<ToolbarFilter
							type={modalType}
							nodeType={type}
							onClose={() => modalRef.current?.close()}
						/>
					)
				}
				closeBtnName="Close"
				onClose={() => addForm.reset()}
			/>
		</>
	);
}
