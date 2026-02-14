import { useNavigate } from "react-router";
import DeathLogBreadcrumb from "../breadcrumb/DeathLogBreadcrumb";
import DLCEDate from "./DLCEDate";
import DLCEDel from "./DLCEDel";
import DLCESubject from "./DLCESubject";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { resolveTimestampUpdate } from "../../../utils/date";
import { isoToDateSTD, isoToTimeSTD } from "../../../utils/date";
import { CONSTANTS } from "../../../../shared/constants";
import { delay } from "../../../utils/general";
import { assertIsNonNull } from "../../../utils/asserts";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNodeFormEditSchema, type NodeFormEdit } from "../schema";
import NavBar from "../../../components/nav-bar/NavBar";
import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";
import useNotifyDateReset from "../../../hooks/useNotifyDateReset";

export default function DeathLogCardEditor({
	node,
}: {
	node: DistinctTreeNode;
}) {
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const deleteNode = useDeathLogStore((state) => state.deleteNode);
	const navigate = useNavigate();

	const {
		timeNotice: timeStartUpdateNotice,
		onResetNotice: onResetTimeStartNotice,
		onTimeNoticeChange: onTimeStartNoticeChange,
	} = useNotifyDateReset();

	const {
		timeNotice: timeEndUpdateNotice,
		onResetNotice: onResetTimeEndNotice,
		onTimeNoticeChange: onTimeEndNoticeChange,
	} = useNotifyDateReset();

	const tree = useDeathLogStore((state) => state.tree);
	const parent = tree.get(node.parentID);
	assertIsNonNull(parent);
	const siblingNames = parent.childIDS.map((id) => {
		const node = tree.get(id);
		assertIsNonNull(node);
		return node.name;
	});
	const NodeFormEditSchema = createNodeFormEditSchema(
		siblingNames,
		node.name,
	);

	const form = useForm<NodeFormEdit>({
		defaultValues: {
			name: node.name,
			dateStart: isoToDateSTD(node.dateStart),
			timeStart: isoToTimeSTD(node.dateStart),
			dateStartRel: node.dateStartRel,
			dateEnd:
				node.completed && node.dateEnd
					? isoToDateSTD(node.dateEnd)
					: null,
			timeEnd:
				node.completed && node.dateEnd
					? isoToTimeSTD(node.dateEnd)
					: null,
			dateEndRel: node.dateEndRel,
			notes: node.notes,
			reoccurring: node.type == "subject" ? node.reoccurring : false,
			context: node.type == "subject" ? node.context : "Boss",
		},
		mode: "onChange",
		resolver: zodResolver(NodeFormEditSchema),
	});

	const onSubmit: SubmitHandler<NodeFormEdit> = (formData) => {
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
				name: formData.name,
				dateStart: dateStart,
				dateStartRel: formData.dateStartRel,
				dateEnd: dateEnd,
				dateEndRel: formData.dateEndRel,
				notes: formData.notes,
			});
		} else if (node.type == "profile") {
			updateNode({
				...node,
				name: formData.name,
				dateStart: dateStart,
				dateStartRel: formData.dateStartRel,
				dateEnd: dateEnd,
				dateEndRel: formData.dateEndRel,
				notes: formData.notes,
			});
		} else if (node.type == "subject") {
			updateNode({
				...node,
				name: formData.name,
				dateStart: dateStart,
				dateStartRel: formData.dateStartRel,
				dateEnd: dateEnd,
				dateEndRel: formData.dateEndRel,
				notes: formData.notes,
				reoccurring: formData.reoccurring,
				context: formData.context,
			});
		}

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
									className={`input ${form.formState.dirtyFields.name ? "input-primary" : ""} w-full`}
									{...form.register("name")}
								/>
								{form.formState.errors.name && (
									<div className="text-error">
										{form.formState.errors.name.message}
									</div>
								)}
							</label>

							<DLCEDate
								node={node}
								form={form}
								timeStartUpdateNotice={timeStartUpdateNotice}
								timeEndUpdateNotice={timeEndUpdateNotice}
								onResetTimeStartNotice={onResetTimeStartNotice}
								onResetTimeEndNotice={onResetTimeEndNotice}
								onTimeStartNoticeChange={
									onTimeStartNoticeChange
								}
								onTimeEndNoticeChange={onTimeEndNoticeChange}
							/>

							{node.type == "subject" ? (
								<DLCESubject node={node} form={form} />
							) : null}

							<label className="floating-label">
								<span>Notes</span>
								<textarea
									className={`${form.formState.dirtyFields.notes ? "textarea-success" : ""} textarea w-full`}
									{...form.register("notes")}
									rows={CONSTANTS.NUMS.TEXTAREA_ROW_MAX}
								/>
								{form.formState.errors.notes && (
									<div className="text-error">
										{form.formState.errors.notes.message}
									</div>
								)}
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
							type="reset"
							className="btn btn-primary mt-4"
							onClick={(e) => {
								e.preventDefault();
								onResetTimeStartNotice();
								onResetTimeEndNotice();
								form.reset();
							}}
							disabled={!form.formState.isDirty}
						>
							{CONSTANTS.DEATH_LOG_EDITOR.RESET}
						</button>

						<button
							type="button"
							className="btn btn-accent w-full"
							onClick={(e) => {
								e.preventDefault();
								navigate("../..");
							}}
						>
							{CONSTANTS.DEATH_LOG_EDITOR.RETURN}
						</button>

						<div className="divider m-3"></div>

						<button
							type="submit"
							className="btn btn-success w-full"
							disabled={
								!form.formState.isValid ||
								!form.formState.isDirty
							}
							onClick={() => {
								onResetTimeStartNotice();
								onResetTimeEndNotice();
							}}
						>
							{CONSTANTS.DEATH_LOG_EDITOR.SUBMIT}
						</button>
					</fieldset>
				</form>
			</div>
		</>
	);
}
