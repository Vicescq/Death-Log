import { useEffect, useRef, useState } from "react";
import add from "../../../assets/add.svg";
import fabEdit from "../../../assets/fab_edit.svg";
import filter from "../../../assets/filter.svg";
import sort from "../../../assets/sort.svg";
import up from "../../../assets/up.svg";
import down from "../../../assets/down.svg";
import Modal from "../../../components/Modal";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import type { VirtuosoHandle } from "react-virtuoso";
import type {
	DistinctTreeNode,
	Subject,
	SubjectContext,
} from "../../../model/TreeNodeModel";
import { formatString } from "../../../stores/utils";
import { CONSTANTS } from "../../../../shared/constants";
import { useForm, type SubmitHandler } from "react-hook-form";
import DLFABModalBodyAdd from "./DLFABModalBodyAdd";

export type SubjectCharacteristics = Pick<Subject, "reoccurring" | "context">;

type Props = {
	type: Exclude<DistinctTreeNode["type"], "ROOT_NODE">;
	parentID: string;
	handleFabOnFocus: () => void;
	handleFabOnBlur: () => void;
	virtuosoRef: React.RefObject<VirtuosoHandle | null>;
	siblingNames: string[];
};

export type AddForm = {
	name: string;
	reoccurring: boolean; // only subjects
	context: SubjectContext; // only subjects
};

export default function DeathLogFAB({
	type,
	parentID,
	handleFabOnFocus,
	handleFabOnBlur,
	virtuosoRef,
	siblingNames,
}: Props) {
	const addNode = useDeathLogStore((state) => state.addNode);
	const modalRef = useRef<HTMLDialogElement>(null);

	const addForm = useForm<AddForm>({
		defaultValues: {
			name: "",
			context: "boss",
			reoccurring: false,
		},
		mode: "onTouched",
	});

	const onAdd: SubmitHandler<AddForm> = (formData) => {
		if (type != "subject") {
			addNode(type, formatString(formData.name), parentID);
		} else {
			addNode(type, formatString(formData.name), parentID, {
				context: formData.context,
				reoccurring: formData.reoccurring,
			});
		}
		modalRef.current?.close();
		console.log(formData);
	};

	const header =
		type != "subject"
			? type[0].toUpperCase() + type.slice(1) + " title"
			: type[0].toUpperCase() +
				type.slice(1) +
				" title & Characteristics";
	return (
		<>
			<div className="fab">
				<div
					tabIndex={0}
					role="button"
					className="btn btn-lg btn-circle bg-success"
					onFocus={handleFabOnFocus}
					onBlur={handleFabOnBlur}
					aria-label={CONSTANTS.DEATH_LOG_FAB.OPEN}
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
						aria-label={CONSTANTS.DEATH_LOG_FAB.ADD}
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
							siblingNames={siblingNames}
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
