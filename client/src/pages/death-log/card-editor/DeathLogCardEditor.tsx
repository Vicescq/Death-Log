import { useLocation, useNavigate, useParams } from "react-router";
import NavBar from "../../../components/navBar/NavBar";
import type {
	DistinctTreeNode,
	SubjectContext,
} from "../../../model/TreeNodeModel";
import DeathLogBreadcrumb from "../breadcrumb/DeathLogBreadcrumb";
import DLCEDate from "./DLCEDate";
import DLCEDel from "./DLCEDel";
import DLCESubject from "./DLCESubject";
import { useForm, type SubmitHandler } from "react-hook-form";
import { formatString, validateString } from "../../../stores/utils";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import {
	formattedStrTosubjectContext,
	subjectContextToFormattedStr,
} from "../utils/utils";
import {
	isoToDateSTD,
	isoToTimeSTD,
	resolveTimestampUpdate,
} from "../utils/dateUtils";
import { CONSTANTS } from "../../../../shared/constants";
import { assertIsNonNull, delay } from "../../../utils";
import { useState } from "react";

export type NodeForm = {
	name: string;
	dateStart: string;
	timeStart: string;
	startRel: boolean;
	dateEnd: string | null;
	timeEnd: string | null;
	endRel: boolean;
	notes: string;

	// only subjects use these
	reoccurring: boolean;
	context: string;
};

export default function DeathLogCardEditor({
	node,
}: {
	node: DistinctTreeNode;
}) {
	const tree = useDeathLogStore((state) => state.tree);

	const parent = tree.get(node.parentID);
	assertIsNonNull(parent);
	const siblingNames = parent.childIDS.map((id) => {
		const sibling = tree.get(id);
		assertIsNonNull(sibling);
		return sibling.name;
	});

	const updateNode = useDeathLogStore((state) => state.updateNode);
	const deleteNode = useDeathLogStore((state) => state.deleteNode);

	const navigate = useNavigate();

	const form = useForm<NodeForm>({
		defaultValues: {
			name: node.name,
			dateStart: isoToDateSTD(node.dateStart),
			timeStart: isoToTimeSTD(node.dateStart),
			startRel: node.dateStartRel,
			dateEnd:
				node.completed && node.dateEnd
					? isoToDateSTD(node.dateEnd)
					: null,
			timeEnd:
				node.completed && node.dateEnd
					? isoToTimeSTD(node.dateEnd)
					: null,
			endRel: node.dateEndRel,
			notes: node.notes,
			reoccurring: node.type == "subject" ? node.reoccurring : false,
			context:
				node.type == "subject"
					? subjectContextToFormattedStr(node.context)
					: "Boss",
		},
		mode: "onTouched",
	});

	const onSubmit: SubmitHandler<NodeForm> = (formData) => {
		const name = formatString(formData.name);
		const dateStart = resolveTimestampUpdate(
			formData.dateStart,
			Boolean(form.formState.dirtyFields.dateStart),
			formData.timeStart,
			Boolean(form.formState.dirtyFields.timeStart),
			node.dateStart,
		);

		let dateEnd: string | null = null;
		if (node.completed) {
			assertIsNonNull(node.dateEnd);
			assertIsNonNull(formData.dateEnd);
			assertIsNonNull(formData.timeEnd);
			dateEnd = resolveTimestampUpdate(
				formData.dateEnd,
				Boolean(form.formState.dirtyFields.dateEnd),
				formData.timeEnd,
				Boolean(form.formState.dirtyFields.timeEnd),
				node.dateEnd,
			);
		}

		if (node.type == "game") {
			updateNode({
				...node,
				name: name,
				dateStart: dateStart,
				dateStartRel: formData.startRel,
				dateEnd: dateEnd,
				dateEndRel: formData.endRel,
				notes: formData.notes,
			});
		} else if (node.type == "profile") {
			updateNode({
				...node,
				name: name,
				dateStart: dateStart,
				dateStartRel: formData.startRel,
				dateEnd: dateEnd,
				dateEndRel: formData.endRel,
				notes: formData.notes,
			});
		} else if (node.type == "subject") {
			updateNode({
				...node,
				name: name,
				dateStart: dateStart,
				dateStartRel: formData.startRel,
				dateEnd: dateEnd,
				dateEndRel: formData.endRel,
				notes: formData.notes,
				reoccurring: formData.reoccurring,
				context: formattedStrTosubjectContext(formData.context),
			});
		}

		// console.log("DIRTY:", form.formState.dirtyFields);
		// console.log("ERR:", form.formState.errors);
		// console.log("DATA:", formData);
		// console.log("REST VALS:", form.getValues());
		form.reset(formData);
	};

	const [delStr, setDelStr] = useState("");

	async function handleDelete(node: DistinctTreeNode) {
		navigate("../..");
		await delay(100); // TODO: maybe figure out a better soln?
		deleteNode(node);
	}

	return (
		<>
			<NavBar
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>

			<div className="m-auto mb-8 w-[90%] sm:max-w-[75%] lg:max-w-[40rem]">
				<h1 className="my-6 text-center text-4xl font-bold">
					Editing: {node.name}
				</h1>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
						<legend className="fieldset-legend">
							View & Edit Fields
						</legend>

						<div className="flex flex-col gap-6">
							<label className="floating-label">
								<span>Name</span>
								<input
									type="search"
									className="input w-full"
									{...form.register("name", {
										validate: (inputText) =>
											validateString(
												inputText,
												siblingNames,
												node.name,
											),
										maxLength: {
											value: CONSTANTS.INPUT_MAX,
											message: CONSTANTS.ERROR.MAX_LENGTH,
										},
									})}
								/>
								{form.formState.errors.name && (
									<div className="text-error">
										{form.formState.errors.name.message}
									</div>
								)}
							</label>

							<DLCEDate node={node} form={form} />

							{node.type == "subject" ? (
								<DLCESubject node={node} form={form} />
							) : null}

							<label className="floating-label">
								<span>Notes</span>
								<textarea
									className="textarea w-full"
									{...form.register("notes")}
								/>
							</label>

							<DLCEDel
								node={node}
								onDelete={handleDelete}
								delStr={delStr}
								onDelStrChange={(inputString) =>
									setDelStr(inputString)
								}
							/>
						</div>

						<button
							type="submit"
							className="btn btn-success mt-4 w-full"
							disabled={
								!form.formState.isValid ||
								!form.formState.isDirty
							}
						>
							Save
						</button>

						<button
							className="btn btn-primary"
							onClick={(e) => {
								e.preventDefault();
								form.reset();
							}}
							disabled={!form.formState.isDirty}
						>
							Reset
						</button>
						<button
							className="btn btn-accent w-full"
							onClick={(e) => {
								e.preventDefault();
								navigate("../..");
							}}
						>
							Return
						</button>
					</fieldset>
				</form>
			</div>
		</>
	);
}
