import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import Container from "../../../components/Container";
import NavBar from "../../../components/nav-bar/NavBar";
import DLPGList from "./DLPGList";
import DLPGModify from "./DLPGModify";
import type { Profile } from "../../../model/tree-node-model/ProfileSchema";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../../utils/asserts";
import DeathLogBreadcrumb from "../breadcrumb/DeathLogBreadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfileGroup } from "../../../stores/utils";
import {
	createPGFormAddSchema,
	type PGFormAdd,
	type PGFormEdit,
} from "../formSchemas";
import Modal from "../../../components/Modal";
import { useRef, useState } from "react";
import DLPGModalBody from "./DLPGModalBody";

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

	const PGFormAddSchema = createPGFormAddSchema(
		profile.groupings.map((group) => group.title),
		null,
	);
	const form = useForm<PGFormAdd>({
		defaultValues: {
			title: "",
			description: "",
			members: [],
		},
		mode: "onChange",
		resolver: zodResolver(PGFormAddSchema),
	});

	const { append, remove } = useFieldArray({
		name: "members",
		control: form.control,
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
		form.reset();
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
		form.reset();
	}

	function handleProfileGroupComplete() {
		updateNode({
			...profile,
			groupings: profile.groupings.map((group, i) => {
				if (i == focusedGroupIndex) {
					return { ...group, completed: !group.completed };
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
					/>
				</fieldset>

				<div className="divider" />

				<form onSubmit={form.handleSubmit(onAddPGSubmit)}>
					<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full gap-4 border p-4">
						<legend className="fieldset-legend">
							Add Profile Group
						</legend>

						<DLPGModify
							subjects={subjects}
							type="add"
							form={form}
							onMemberAdd={(id) => append({ memberID: id })}
							onMemberDelete={(i) => remove(i)}
						/>

						<button
							type="submit"
							className="btn btn-success mt-4 w-full"
							disabled={!form.formState.isValid}
						>
							Add
						</button>
					</fieldset>
				</form>
			</Container>

			<Modal
				header={
					modalType == "completion"
						? "Confirm Completion Status"
						: "Confirm Deletion"
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
			/>
		</>
	);
}
