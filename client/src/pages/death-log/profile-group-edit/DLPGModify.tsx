import { useState } from "react";
import { CONSTANTS } from "../../../../shared/constants";
import type {
	Profile,
	ProfileGroup,
	Subject,
} from "../../../model/TreeNodeModel";
import { formatString } from "../../../stores/utils";
import { assertIsNonNull } from "../../../utils";
import { getFormStatus } from "../utils";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";

type Props = {
	profile: Profile;
	subjects: Subject[];
	type: "add" | "edit";
	modifiedProfileGroup: ProfileGroup;
	currEditingProfileGroupIndex: number | null;
	onModifiedProfileGroup: (profileGroup: ProfileGroup) => void;
	onCancelModify: () => void;
};

export default function DLPGModify({
	profile,
	subjects,
	type,
	modifiedProfileGroup,
	currEditingProfileGroupIndex,
	onModifiedProfileGroup,
	onCancelModify,
}: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const [subjectSearchQuery, setSubjectSearchQuery] = useState("");

	const filteredSubjectSearches =
		subjectSearchQuery == ""
			? []
			: subjects.filter(
					(subject) =>
						subject.name
							.toLowerCase()
							.includes(subjectSearchQuery.toLowerCase()) &&
						!modifiedProfileGroup.members.includes(subject.id),
				);

	const { inputTextError, submitBtnCSS } = getFormStatus(
		modifiedProfileGroup.title,
		type == "edit" && currEditingProfileGroupIndex != null
			? {
					type: "profileGroupEdit",
					profile: profile,
					profileGroup: modifiedProfileGroup,
					originalProfileGroup:
						profile.groupings[currEditingProfileGroupIndex],
				}
			: {
					type: "profileGroupAdd",
					profile: profile,
				},
	);

	function handleProfileGroupAdd() {
		updateNode(profile, {
			...profile,
			groupings: [...profile.groupings, modifiedProfileGroup],
		});
		onModifiedProfileGroup({
			title: "",
			description: "",
			members: [],
		});
		setSubjectSearchQuery("");
	}

	function handleProfileGroupEdit() {
		updateNode(profile, {
			...profile,
			groupings: profile.groupings.map((group, i) => {
				if (i != currEditingProfileGroupIndex) {
					return group;
				} else {
					return modifiedProfileGroup;
				}
			}),
		});
	}

	function handleProfileGroupMemberAdd(i: number) {
		onModifiedProfileGroup({
			...modifiedProfileGroup,
			members: [
				...modifiedProfileGroup.members,
				filteredSubjectSearches[i].id,
			],
		});
	}

	return (
		<fieldset
			className={`fieldset ${type == "add" ? "bg-base-200" : "bg-base-300"} border-base-300 rounded-box mt-4 border p-4`}
		>
			<legend className="fieldset-legend">
				{type == "add"
					? "Add a new Profile Group"
					: currEditingProfileGroupIndex != null
						? `Editing Profile Group: ${profile.groupings[currEditingProfileGroupIndex].title}`
						: null}
			</legend>

			<label className="label">Title</label>
			<div className="join">
				<input
					type="search"
					className="input join-item w-full"
					placeholder={
						type == "add" ? "New Profile Group" : undefined
					}
					maxLength={CONSTANTS.INPUT_MAX}
					value={modifiedProfileGroup.title}
					onChange={(e) => {
						onModifiedProfileGroup({
							...modifiedProfileGroup,
							title: e.currentTarget.value,
						});
					}}
					onBlur={(e) => {
						onModifiedProfileGroup({
							...modifiedProfileGroup,
							title: formatString(e.currentTarget.value),
						});
					}}
				/>
				<button
					className={`btn ${submitBtnCSS} join-item rounded-r-full`}
					onClick={() =>
						type == "add"
							? handleProfileGroupAdd()
							: handleProfileGroupEdit()
					}
					disabled={submitBtnCSS == "btn-disabled"}
				>
					{type == "add" ? "+" : "Edit"}
				</button>
			</div>
			<span className="text-error">{inputTextError}</span>
			<label className="label mt-4">Description</label>
			<textarea
				className="textarea w-full"
				value={modifiedProfileGroup.description}
				onChange={(e) => {
					onModifiedProfileGroup({
						...modifiedProfileGroup,
						description: e.currentTarget.value,
					});
				}}
				maxLength={CONSTANTS.TEXTAREA.TEXTAREA_MAX}
				rows={CONSTANTS.TEXTAREA.TEXTAREA_ROWS}
			/>

			{modifiedProfileGroup.members.length > 0 ? (
				<label className="label mt-4">
					{type == "add"
						? "Adding the following subjects to this group:"
						: "Members that belong to this group:"}
				</label>
			) : null}

			<ul className="list">
				{modifiedProfileGroup.members.map((id) => {
					const subject = tree.get(id);
					assertIsNonNull(subject);
					return (
						<li className="list-row" key={id}>
							{subject.name}
							<span
								className="ml-auto cursor-pointer"
								onClick={() =>
									onModifiedProfileGroup({
										...modifiedProfileGroup,
										members:
											modifiedProfileGroup.members.filter(
												(memberID) => memberID != id,
											),
									})
								}
							>
								✕
							</span>
						</li>
					);
				})}
			</ul>

			<label className="label mt-4">Search and Add subjects</label>
			<input
				type="search"
				placeholder="Search for subjects to add"
				className="input w-full"
				value={subjectSearchQuery}
				onChange={(e) => setSubjectSearchQuery(e.currentTarget.value)}
			/>
			<ul className="list max-h-[30rem] overflow-auto">
				{subjectSearchQuery != "" &&
				filteredSubjectSearches.length != 0 ? (
					filteredSubjectSearches.map((subject, i) => {
						return (
							<li className="list-row" key={i}>
								{subject.name}{" "}
								<span
									className="ml-auto hover:cursor-pointer"
									onClick={() =>
										handleProfileGroupMemberAdd(i)
									}
								>
									+
								</span>
							</li>
						);
					})
				) : subjectSearchQuery != "" ? (
					<span className="text-error">
						No matching names have been found!
					</span>
				) : null}
			</ul>
			{type == "edit" ? (
				<button className="btn btn-error" onClick={onCancelModify}>
					Cancel Changes
				</button>
			) : null}
		</fieldset>
	);
}
