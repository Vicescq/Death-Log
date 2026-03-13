import { CONSTANTS } from "../../../../shared/constants";
import DateRangeForm from "../../../components/DateRangeForm";
import DLPGBaseModifyLayout from "./DLPGBaseModifyLayout";
import type { Profile } from "../../../model/tree-node-model/ProfileSchema";
import {
	useFieldArray,
	useForm,
	useWatch,
	type SubmitHandler,
} from "react-hook-form";
import { createPGFormEditSchema, type PGFormEdit } from "../formSchemas";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import useNotifyDateReset from "../../../hooks/useNotifyDateReset";
import type { Subject } from "../../../model/tree-node-model/SubjectSchema";
import {
	isoToDateSTD,
	isoToTimeSTD,
	resolveTimestampUpdate,
} from "../../../utils/date";
import { assertIsNonNull } from "../../../utils/asserts";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";

type Props = {
	profile: Profile;
	focusedGroupIndex: number;
	subjects: Subject[];
};

export default function DLPGEdit({
	profile,
	focusedGroupIndex,
	subjects,
}: Props) {
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const currGroup = profile.groupings[focusedGroupIndex];
	const [searchQuery, setSearchQuery] = useState("");

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

	const PGFormEditSchema = createPGFormEditSchema(
		profile.groupings.map((group) => group.title),
		profile.groupings[focusedGroupIndex].title,
	);

	const defaultValues =
		currGroup.completed && currGroup.dateEnd
			? {
					title: currGroup.title,
					description: currGroup.description,
					members: currGroup.members.map((id) => ({
						memberID: id,
					})),
					dateStart: isoToDateSTD(currGroup.dateStart),
					timeStart: isoToTimeSTD(currGroup.dateStart),
					dateStartRel: currGroup.dateStartRel,
					dateEnd: isoToDateSTD(currGroup.dateEnd),
					timeEnd: isoToTimeSTD(currGroup.dateEnd),
					dateEndRel: currGroup.dateEndRel,
				}
			: {
					title: currGroup.title,
					description: currGroup.description,
					members: currGroup.members.map((id) => ({
						memberID: id,
					})),
					dateStart: isoToDateSTD(currGroup.dateStart),
					timeStart: isoToTimeSTD(currGroup.dateStart),
					dateStartRel: currGroup.dateStartRel,
					dateEnd: null,
					timeEnd: null,
					dateEndRel: currGroup.dateEndRel,
				};

	const form = useForm<PGFormEdit>({
		defaultValues: defaultValues,
		mode: "onChange",
		resolver: zodResolver(PGFormEditSchema),
	});

	const { isValid, isDirty } = form.formState; // same comment from DL Editor component: https://github.com/Vicescq/Death-Log/issues/36

	const { append, remove } = useFieldArray({
		name: "members",
		control: form.control,
	});

	const onSubmit: SubmitHandler<PGFormEdit> = (formData) => {
		const dateStart = resolveTimestampUpdate(
			formData.dateStart,
			Boolean(form.formState.dirtyFields.dateStart),
			formData.timeStart,
			Boolean(form.formState.dirtyFields.timeStart),
			currGroup.dateStart,
		);

		let dateEnd: string | null = null;
		if (currGroup.completed) {
			assertIsNonNull(currGroup.dateEnd);
			assertIsNonNull(formData.dateEnd);
			assertIsNonNull(formData.timeEnd);
			dateEnd = resolveTimestampUpdate(
				formData.dateEnd,
				Boolean(form.formState.dirtyFields.dateEnd),
				formData.timeEnd,
				Boolean(form.formState.dirtyFields.timeEnd),
				currGroup.dateEnd,
			);
		}

		updateNode({
			...profile,
			groupings: profile.groupings.map((group, i) => {
				if (focusedGroupIndex == i) {
					return {
						...group,
						title: formData.title,
						description: formData.description,
						members: formData.members.map(
							(member) => member.memberID,
						),
						dateStart: dateStart,
						dateStartRel: formData.dateStartRel,
						dateEnd: dateEnd,
						dateEndRel: formData.dateEndRel,
					};
				} else {
					return group;
				}
			}),
		});
		form.reset(formData);
	};

	useEffect(() => {
		setSearchQuery("");
		form.reset(defaultValues);
	}, [focusedGroupIndex]);

	return (
		<>
			<div className="divider">↓ Edit Mode ↓</div>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full gap-4 border p-4">
					<legend className="fieldset-legend">
						Editing: {profile.groupings[focusedGroupIndex].title}
					</legend>

					<DLPGBaseModifyLayout
						errors={{
							title: form.formState.errors.title,
							description: form.formState.errors.description,
						}}
						members={form.getValues("members")}
						onChangeSearchQuery={(query) => setSearchQuery(query)}
						onMemberAdd={(id) => append({ memberID: id })}
						onMemberDelete={(i) => remove(i)}
						register={form.register}
						registeredNames={{
							title: "title",
							description: "description",
						}}
						searchQuery={searchQuery}
						subjects={subjects}
						type="edit"
					/>

					<DateRangeForm
						contextObj={profile.groupings[focusedGroupIndex]}
						register={form.register}
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
									form.setValue("timeStart", "00:00:00", {
										shouldDirty: true,
										shouldValidate: true,
									});
									onTimeStartNoticeChange(
										CONSTANTS.INFO.TIME_RESET_NOTICE,
									);
								},
							},
							timeStart: {
								onChange: () => {
									onResetTimeStartNotice();
									form.trigger("dateStart");
								},
							},
							dateEnd: {
								onChange: () => {
									form.setValue("timeEnd", "00:00:00", {
										shouldDirty: true,
										shouldValidate: true,
									});
									onTimeEndNoticeChange(
										CONSTANTS.INFO.TIME_RESET_NOTICE,
									);
								},
							},
							timeEnd: {
								onChange: () => {
									onResetTimeEndNotice();
									form.trigger("dateEnd");
								},
							},
						}}
						dirtyFields={{
							dateStart: form.formState.dirtyFields.dateStart,
							timeStart: form.formState.dirtyFields.timeStart,
							dateStartRel:
								form.formState.dirtyFields.dateStartRel,
							dateEnd: form.formState.dirtyFields.dateEnd,
							timeEnd: form.formState.dirtyFields.timeEnd,
							dateEndRel: form.formState.dirtyFields.dateEndRel,
						}}
						errors={{
							dateStart: form.formState.errors.dateStart,
							timeStart: form.formState.errors.timeStart,

							dateEnd: form.formState.errors.dateEnd,
							timeEnd: form.formState.errors.timeEnd,
						}}
						timeStartUpdateNotice={timeStartUpdateNotice}
						timeEndUpdateNotice={timeEndUpdateNotice}
					/>
					<div>
						<button
							type="reset"
							className="btn btn-primary w-full"
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

						<div className="divider m-3"></div>

						<button
							type="submit"
							className="btn btn-success mt-4 w-full"
							disabled={!isDirty || !isValid}
						>
							{CONSTANTS.DEATH_LOG_EDITOR.SUBMIT}
						</button>
					</div>
				</fieldset>
			</form>
		</>
	);
}
