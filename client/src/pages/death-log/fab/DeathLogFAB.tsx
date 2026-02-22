import { useRef } from "react";
import add from "../../../assets/add.svg";
import fabEdit from "../../../assets/fab_edit.svg";
import filter from "../../../assets/filter.svg";
import sort from "../../../assets/sort.svg";
import up from "../../../assets/up.svg";
import down from "../../../assets/down.svg";
import Modal from "../../../components/Modal";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import type { VirtuosoHandle } from "react-virtuoso";
import { CONSTANTS } from "../../../../shared/constants";
import { useForm, type SubmitHandler } from "react-hook-form";
import DLFABModalBodyAdd from "./DLFABModalBodyAdd";
import { zodResolver } from "@hookform/resolvers/zod";
import { assertIsNonNull } from "../../../utils/asserts";
import { createNodeFormAddSchema, type NodeFormAdd } from "../schema";
import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";

type Props = {
	onFocus: () => void;
	onBlur: () => void;
	virtuosoRef: React.RefObject<VirtuosoHandle | null>;
	parent: DistinctTreeNode;
};

export default function DeathLogFAB({
	onFocus,
	onBlur,
	virtuosoRef,
	parent,
}: Props) {
	const addNode = useDeathLogStore((state) => state.addNode);
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

	const NodeFormAdd = createNodeFormAddSchema(siblingNames, null);

	const addForm = useForm<NodeFormAdd>({
		defaultValues: {
			name: "",
			context: "Boss",
			reoccurring: false,
		},
		mode: "onChange",
		resolver: zodResolver(NodeFormAdd),
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

	const header = "Add " + type[0].toUpperCase() + type.slice(1);

	return (
		<>
			<div className="fab">
				<div
					tabIndex={0}
					role="button"
					className="btn btn-lg btn-circle bg-success"
					onFocus={onFocus}
					onBlur={onBlur}
					aria-label={CONSTANTS.DEATH_LOG_FAB.OPEN_ARIA}
				>
					<img src={fabEdit} alt="" />
				</div>

				<div className="fab-close">
					Close
					<span className="btn btn-circle btn-lg btn-error">✕</span>
				</div>

				<div>
					Add {type}
					<button
						role="button"
						aria-label={CONSTANTS.DEATH_LOG_FAB.ADD_ARIA}
						className="btn btn-lg btn-circle btn-success"
						onClick={() => modalRef.current?.showModal()}
					>
						<img src={add} alt="" />
					</button>
				</div>
				<div>
					Sort {type}s
					<button
						className="btn btn-lg btn-circle btn-neutral"
						onClick={() => modalRef.current?.showModal()}
					>
						<img src={sort} alt="" />
					</button>
				</div>
				<div>
					Filter {type}s
					<button
						className="btn btn-lg btn-circle btn-neutral"
						onClick={() => modalRef.current?.showModal()}
					>
						<img src={filter} alt="" />
					</button>
				</div>
				<div>
					Bottom
					<button
						className="btn btn-lg btn-circle btn-neutral"
						onClick={() => {
							virtuosoRef.current?.scrollToIndex({
								index: "LAST",
								behavior: "smooth",
							});

							if (document.activeElement instanceof HTMLElement) {
								document.activeElement.blur();
							}
						}}
					>
						<img src={down} alt="" />
					</button>
				</div>
				<div>
					Top
					<button
						className="btn btn-lg btn-circle btn-neutral"
						onClick={() => {
							window.scrollTo({
								top: 0,
								left: 0,
								behavior: "smooth",
							});
							if (document.activeElement instanceof HTMLElement) {
								document.activeElement.blur();
							}
						}}
					>
						<img src={up} alt="" />
					</button>
				</div>
			</div>
			<Modal
				ref={modalRef}
				header={header}
				content={
					<>
						<DLFABModalBodyAdd
							type={type}
							form={addForm}
							onAdd={onAdd}
						/>
					</>
				}
				closeBtnName="Close"
				modalBtns={[]}
				onClose={() => addForm.reset()}
			/>
		</>
	);
}
