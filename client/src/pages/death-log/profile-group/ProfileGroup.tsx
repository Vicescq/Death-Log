import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import Container from "../../../components/Container";
import NavBar from "../../../components/nav-bar/NavBar";
import ProfileGroupList from "./ProfileGroupList";
import type { Profile } from "../../../model/tree-node-model/ProfileSchema";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../../utils/asserts";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfileGroup } from "../../../stores/utils";
import { createPGFormAddSchema, type PGFormAdd } from "../../../model/formSchemas";
import Modal from "../../../components/Modal";
import { useRef, useState } from "react";
import ProfileGroupModalBody from "./ProfileGroupModalBody";
import ProfileGroupBaseModifyLayout from "./ProfileGroupBaseModifyLayout";
import ProfileGroupEdit from "./ProfileGroupEdit";

type Props = {
	profile: Profile;
};

export default function ProfileGroup({ profile }: Props) {
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
	const [searchQuery, setSearchQuery] = useState("");

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

	const onSubmit: SubmitHandler<PGFormAdd> = (formData) => {
		updateNode({
			...profile,
			groupings: [
				...profile.groupings,
				createProfileGroup(profile, formData),
			],
		});
		setSearchQuery(""); // fixes bug where state and HTML val gets unsync due to how .reset() is implemented, this forces search query in terms of react state to reset so other logic is correctly operating
		form.reset();
	};

	function handleProfileGroupDelete() {
		updateNode({
			...profile,
			groupings: profile.groupings.filter(
				(_, i) => i != focusedGroupIndex,
			),
		});
		modalRef.current?.close();
		form.reset();
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
		setIsEditing(false);
	}

	function handleEdit(i: number) {
		if (focusedGroupIndex == i) {
			setFocusedGroupIndex(null);
			setIsEditing(false);
		} else {
			setFocusedGroupIndex(i);
			setIsEditing(true);
		}
	}

	return (
		<>
			<NavBar endNavContent={<Breadcrumb />} />
			<Container css="mb-8">
				<h1 className="my-6 text-center text-4xl font-bold wrap-break-word">
					Editing: {profile.name}
				</h1>

				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full gap-4 border p-4">
					<legend className="fieldset-legend">
						Current Profile Groups
					</legend>
					<ProfileGroupList
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

				<form onSubmit={form.handleSubmit(onSubmit)}>
					<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full gap-4 border p-4">
						<legend className="fieldset-legend">
							Add Profile Group
						</legend>

						<ProfileGroupBaseModifyLayout
							errors={{
								title: form.formState.errors.title,
								description: form.formState.errors.description,
							}}
							members={form.getValues("members")}
							onChangeSearchQuery={(query) =>
								setSearchQuery(query)
							}
							onMemberAdd={(id) => append({ memberID: id })}
							onMemberDelete={(i) => remove(i)}
							register={form.register}
							registeredNames={{
								title: "title",
								description: "description",
							}}
							searchQuery={searchQuery}
							subjects={subjects}
							type="add"
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

				{focusedGroupIndex != null && isEditing ? (
					<ProfileGroupEdit
						profile={profile}
						subjects={subjects}
						focusedGroupIndex={focusedGroupIndex}
					/>
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
					<ProfileGroupModalBody
						focusedGroupIndex={focusedGroupIndex}
						modalType={modalType}
						onProfileGroupComplete={handleProfileGroupComplete}
						onProfileGroupDelete={handleProfileGroupDelete}
						profile={profile}
					/>
				}
				ref={modalRef}
				onClose={() => setFocusedGroupIndex(null)}
			/>
		</>
	);
}
