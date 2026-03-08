import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import Container from "../../../components/Container";
import NavBar from "../../../components/nav-bar/NavBar";
import DLPGList from "./DLPGList";
import type { Profile } from "../../../model/tree-node-model/ProfileSchema";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../../utils/asserts";
import DeathLogBreadcrumb from "../breadcrumb/DeathLogBreadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfileGroup } from "../../../stores/utils";
import {
	createPGFormAddSchema,
	createPGFormEditSchema,
	type PGFormAdd,
	type PGFormEdit,
} from "../formSchemas";
import Modal from "../../../components/Modal";
import { useRef, useState } from "react";
import DLPGModalBody from "./DLPGModalBody";
import DLPGBaseModifyLayout from "./DLPGBaseModifyLayout";
import { CONSTANTS } from "../../../../shared/constants";
import DateRangeForm from "../../../components/DateRangeForm";
import useNotifyDateReset from "../../../hooks/useNotifyDateReset";
import { isoToDateSTD, isoToTimeSTD } from "../../../utils/date";

type Props = {
	profile: Profile;
};

export default function DeathLogProfileGroup({ profile }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const modalRef = useRef<HTMLDialogElement | null>(null);

	const [modalType, setModalType] = useState<"completion" | "delete">(
		"completion",
	);
	const [focusedGroupIndex, setFocusedGroupIndex] = useState<number | null>(
		null,
	);
	const [isEditing, setIsEditing] = useState(false);
	const [addSearchQuery, setAddSearchQuery] = useState("");
	const [editSearchQuery, setEditSearchQuery] = useState("");

	const PGFormAddSchema = createPGFormAddSchema(
		profile.groupings.map((group) => group.title),
		null,
	);
	const addForm = useForm<PGFormAdd>({
		defaultValues: {
			title: "",
			description: "",
			members: [],
		},
		mode: "onChange",
		resolver: zodResolver(PGFormAddSchema),
	});

	const PGFormEditSchema = createPGFormEditSchema(
		profile.groupings.map((group) => group.title),
		focusedGroupIndex != null
			? profile.groupings[focusedGroupIndex].title
			: null,
	);
	const editForm = useForm<PGFormEdit>({
		mode: "onChange",
		resolver: zodResolver(PGFormEditSchema),
	});

	const { append: pgAddAppend, remove: pgAddRemove } = useFieldArray({
		name: "members",
		control: addForm.control,
	});
	const {
		append: pgEditAppend,
		remove: pgEditRemove,
		replace: pgEditReplace,
	} = useFieldArray({
		name: "members",
		control: editForm.control,
	});

	const subjects = profile.childIDS.map((id) => {
		const subject = tree.get(id);
		assertIsNonNull(subject);
		assertIsSubject(subject);
		return subject;
	});

	const onAddPGSubmit: SubmitHandler<PGFormAdd> = (formData) => {
		updateNode({
			...profile,
			groupings: [
				...profile.groupings,
				createProfileGroup(profile, formData),
			],
		});
		setAddSearchQuery(""); // fixes bug where state and HTML val gets unsync due to how .reset() is implemented, this forces search query in terms of react state to reset so other logic is correctly operating
		addForm.reset();
	};

	const onEditPGSubmit: SubmitHandler<PGFormEdit> = (formData) => {};

	function handleProfileGroupDelete() {
		updateNode({
			...profile,
			groupings: profile.groupings.filter(
				(_, i) => i != focusedGroupIndex,
			),
		});
		modalRef.current?.close();
		addForm.reset();
		setFocusedGroupIndex(null); // here instead due to delete bug referencing non existant array index, have to set it for later ternary statement to not throw error
	}

	function handleProfileGroupComplete() {
		updateNode({
			...profile,
			groupings: profile.groupings.map((group, i) => {
				if (i == focusedGroupIndex) {
					if (group.completed) {
						// turn into incomplete
						return {
							...group,
							completed: !group.completed,
							dateEnd: null,
						};
					} else {
						// turn into complete
						return {
							...group,
							completed: !group.completed,
							dateEnd: new Date().toISOString(),
						};
					}
				} else {
					return group;
				}
			}),
		});
		modalRef.current?.close();
	}

	function handleModalTypeChange(type: "completion" | "delete", i: number) {
		modalRef.current?.showModal();
		setModalType(type);
		setFocusedGroupIndex(i);
	}

	function handleEdit(i: number) {
		editForm.reset(); // in order to avoid dirtyField CSS activating, but resetting is not enough, need to manually setValue() each field
		pgEditReplace([]);
		if (focusedGroupIndex == i) {
			setFocusedGroupIndex(null);
			setIsEditing(false);
		} else {
			setFocusedGroupIndex(i);
			setIsEditing(true);

			editForm.setValue("title", profile.groupings[i].title);
			editForm.setValue("description", profile.groupings[i].description);
			profile.groupings[i].members.map((id) =>
				pgEditAppend({ memberID: id }),
			);
			editForm.setValue(
				"dateStart",
				isoToDateSTD(profile.groupings[i].dateStart),
			);
			editForm.setValue(
				"timeStart",
				isoToTimeSTD(profile.groupings[i].dateStart),
			);
			editForm.setValue(
				"dateStartRel",
				profile.groupings[i].dateStartRel,
			);

			if (
				profile.groupings[i].completed &&
				profile.groupings[i].dateEnd
			) {
				editForm.setValue(
					"dateEnd",
					isoToDateSTD(profile.groupings[i].dateEnd),
				);
				editForm.setValue(
					"timeEnd",
					isoToTimeSTD(profile.groupings[i].dateEnd),
				);
				editForm.setValue(
					"dateStartRel",
					profile.groupings[i].dateEndRel,
				);
			}
		}
	}

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

	return (
		<>
			<NavBar endNavContent={<DeathLogBreadcrumb />} />
			<Container>
				<h1 className="my-6 text-center text-4xl font-bold break-words">
					Editing: {profile.name}
				</h1>

				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full gap-4 border p-4">
					<legend className="fieldset-legend">
						Current Profile Groups
					</legend>
					<DLPGList
						profile={profile}
						onDelete={(i) => handleModalTypeChange("delete", i)}
						onComplete={(i) =>
							handleModalTypeChange("completion", i)
						}
						focusedGroupIndex={focusedGroupIndex}
						onEdit={(i) => handleEdit(i)}
					/>
				</fieldset>

				<div className="divider" />

				<form onSubmit={addForm.handleSubmit(onAddPGSubmit)}>
					<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full gap-4 border p-4">
						<legend className="fieldset-legend">
							Add Profile Group
						</legend>

						<DLPGBaseModifyLayout
							errors={{
								title: addForm.formState.errors.title,
								description:
									addForm.formState.errors.description,
							}}
							members={addForm.getValues("members")}
							onChangeSearchQuery={(query) =>
								setAddSearchQuery(query)
							}
							onMemberAdd={(id) => pgAddAppend({ memberID: id })}
							onMemberDelete={(i) => pgAddRemove(i)}
							register={addForm.register}
							registeredNames={{
								title: "title",
								description: "description",
							}}
							searchQuery={addSearchQuery}
							subjects={subjects}
						/>

						<button
							type="submit"
							className="btn btn-success mt-4 w-full"
							disabled={!addForm.formState.isValid}
						>
							Add
						</button>
					</fieldset>
				</form>

				{focusedGroupIndex != null && isEditing ? (
					<>
						<div className="divider">↓ Edit Mode ↓</div>
						<form onSubmit={addForm.handleSubmit(onAddPGSubmit)}>
							<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full gap-4 border p-4">
								<legend className="fieldset-legend">
									Editing:{" "}
									{profile.groupings[focusedGroupIndex].title}
								</legend>

								<DLPGBaseModifyLayout
									errors={{
										title: editForm.formState.errors.title,
										description:
											editForm.formState.errors
												.description,
									}}
									members={editForm.getValues("members")}
									onChangeSearchQuery={(query) =>
										setEditSearchQuery(query)
									}
									onMemberAdd={(id) =>
										pgEditAppend({ memberID: id })
									}
									onMemberDelete={(i) => pgEditRemove(i)}
									register={editForm.register}
									registeredNames={{
										title: "title",
										description: "description",
									}}
									searchQuery={editSearchQuery}
									subjects={subjects}
								/>

								<DateRangeForm
									contextObj={
										profile.groupings[focusedGroupIndex]
									}
									register={editForm.register}
									registeredNames={{
										dateStart: "dateStart",
										timeStart: "timeStart",
										dateStartRel: "dateStartRel",
										dateEnd: "dateEnd",
										timeEnd: "timeEnd",
										dateEndRel: "dateEndRel",
									}}
									registeredOptions={{
										dateStart: {
											onChange: () => {
												editForm.setValue(
													"timeStart",
													"00:00:00",
													{
														shouldDirty: true,
														shouldValidate: true,
													},
												);
												onTimeStartNoticeChange(
													CONSTANTS.INFO
														.TIME_RESET_NOTICE,
												);
											},
										},
										timeStart: {
											onChange: () => {
												onResetTimeStartNotice();
												editForm.trigger("dateStart");
											},
										},
										dateEnd: {
											onChange: () => {
												editForm.setValue(
													"timeEnd",
													"00:00:00",
													{
														shouldDirty: true,
														shouldValidate: true,
													},
												);
												onTimeEndNoticeChange(
													CONSTANTS.INFO
														.TIME_RESET_NOTICE,
												);
											},
										},
										timeEnd: {
											onChange: () => {
												onResetTimeEndNotice();
												editForm.trigger("dateEnd");
											},
										},
									}}
									dirtyFields={{
										dateStart:
											editForm.formState.dirtyFields
												.dateStart,
										timeStart:
											editForm.formState.dirtyFields
												.timeStart,
										dateStartRel:
											editForm.formState.dirtyFields
												.dateStartRel,
										dateEnd:
											editForm.formState.dirtyFields
												.dateEnd,
										timeEnd:
											editForm.formState.dirtyFields
												.timeEnd,
										dateEndRel:
											editForm.formState.dirtyFields
												.dateEndRel,
									}}
									errors={{
										dateStart:
											editForm.formState.errors.dateStart,
										timeStart:
											editForm.formState.errors.timeStart,

										dateEnd:
											editForm.formState.errors.dateEnd,
										timeEnd:
											editForm.formState.errors.timeEnd,
									}}
									timeStartUpdateNotice={
										timeStartUpdateNotice
									}
									timeEndUpdateNotice={timeEndUpdateNotice}
								/>

								<button
									type="submit"
									className="btn btn-success mt-4 w-full"
									disabled={!addForm.formState.isValid}
								>
									Add
								</button>
							</fieldset>
						</form>
					</>
				) : null}
			</Container>

			<Modal
				header={
					focusedGroupIndex != null && modalType == "completion"
						? `Confirm Completion Status: ${profile.groupings[focusedGroupIndex].title}`
						: focusedGroupIndex != null
							? `Confirm Deletion: ${profile.groupings[focusedGroupIndex].title}`
							: "ERROR with rendering, pelase reload this page!"
				}
				closeBtnName="Cancel"
				content={
					<DLPGModalBody
						focusedGroupIndex={focusedGroupIndex}
						modalType={modalType}
						onProfileGroupComplete={handleProfileGroupComplete}
						onProfileGroupDelete={handleProfileGroupDelete}
						profile={profile}
					/>
				}
				modalBtns={[]}
				ref={modalRef}
				onClose={() => setFocusedGroupIndex(null)}
			/>
		</>
	);
}
