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
import useConsoleLogOnStateChange from "../../../hooks/useConsoleLogOnStateChange";

type Props = {
	profile: Profile;
	subjects: Subject[];
};

export default function DLPGModify({ profile, subjects }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const [newProfileGroup, setNewProfileGroup] = useState<ProfileGroup>({
		title: "",
		description: "",
		members: [],
	});
	const [subjectSearchQuery, setSubjectSearchQuery] = useState("");

	const filteredSubjectSearches =
		subjectSearchQuery == ""
			? []
			: subjects.filter(
					(subject) =>
						subject.name
							.toLowerCase()
							.includes(subjectSearchQuery.toLowerCase()) &&
						!newProfileGroup.members.includes(subject.id),
				);

	const { inputTextError, submitBtnCSS } = getFormStatus(
		newProfileGroup.title,
		{
			type: "profileGroupAdd",
			profile: profile,
		},
	);

	function onProfileGroupAdd() {
		updateNode(profile, {
			...profile,
			groupings: [...profile.groupings, newProfileGroup],
		});
		setNewProfileGroup({
			title: "",
			description: "",
			members: [],
		});
	}

	function onProfileGroupMemberAdd(i: number) {
		setNewProfileGroup({
			...newProfileGroup,
			members: [
				...newProfileGroup.members,
				filteredSubjectSearches[i].id,
			],
		});
	}
	useConsoleLogOnStateChange(newProfileGroup, newProfileGroup);

	return (
		<fieldset className="fieldset bg-base-200 border-base-300 rounded-box mt-4 border p-4">
			<legend className="fieldset-legend">Add a new Profile Group</legend>

			<label className="label">Title</label>
			<div className="join">
				<input
					type="search"
					className="input join-item w-full"
					placeholder="New Profile Group"
					maxLength={CONSTANTS.INPUT_MAX}
					value={newProfileGroup.title}
					onChange={(e) => {
						setNewProfileGroup({
							...newProfileGroup,
							title: e.currentTarget.value,
						});
					}}
					onBlur={(e) => {
						setNewProfileGroup({
							...newProfileGroup,
							title: formatString(e.currentTarget.value),
						});
					}}
				/>
				<button
					className={`btn ${submitBtnCSS} join-item rounded-r-full`}
					onClick={() => onProfileGroupAdd()}
					disabled={submitBtnCSS == "btn-disabled"}
				>
					+
				</button>
			</div>
			<span className="text-error">{inputTextError}</span>
			<label className="label mt-4">Description</label>
			<textarea
				className="textarea w-full"
				value={newProfileGroup.description}
				onChange={(e) => {
					setNewProfileGroup({
						...newProfileGroup,
						description: e.currentTarget.value,
					});
				}}
				maxLength={CONSTANTS.TEXTAREA.TEXTAREA_MAX}
				rows={CONSTANTS.TEXTAREA.TEXTAREA_ROWS}
			/>

			{newProfileGroup.members.length > 0 ? (
				<label className="label mt-4">
					Adding the following subjects to this group:
				</label>
			) : null}

			<ul className="list">
				{newProfileGroup.members.map((id) => {
					const subject = tree.get(id);
					assertIsNonNull(subject);
					return (
						<li className="list-row">
							{subject.name}
							<span
								className="ml-auto cursor-pointer"
								onClick={() =>
									setNewProfileGroup({
										...newProfileGroup,
										members: newProfileGroup.members.filter(
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
									onClick={() => onProfileGroupMemberAdd(i)}
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
		</fieldset>
	);
}
