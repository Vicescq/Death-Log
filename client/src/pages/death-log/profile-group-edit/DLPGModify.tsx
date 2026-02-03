import { useState } from "react";
import { CONSTANTS } from "../../../../shared/constants";
import type {
	Profile,
	ProfileGroup,
	Subject,
} from "../../../model/TreeNodeModel";
import { formatString } from "../../../stores/utils";
import { assertIsNonNull } from "../../../utils";
import { getFormStatus } from "../utils/utils";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";

type Props = AddProps | EditProps;

type AddProps = {
	profile: Profile;
	subjects: Subject[];
	type: "add";
	modifiedProfileGroup: ProfileGroup;
	onModifiedProfileGroup: (profileGroup: ProfileGroup) => void;
};

type EditProps = {
	profile: Profile;
	subjects: Subject[];
	type: "edit";
	modifiedProfileGroup: ProfileGroup;
	currEditingProfileGroupIndex: number;
	onModifiedProfileGroup: (profileGroup: ProfileGroup) => void;
	onCancelModify: () => void;
};

export default function DLPGModify(props: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const [subjectSearchQuery, setSubjectSearchQuery] = useState("");

	const filteredSubjectSearches =
		subjectSearchQuery == ""
			? []
			: props.subjects.filter(
					(subject) =>
						subject.name
							.toLowerCase()
							.includes(subjectSearchQuery.toLowerCase()) &&
						!props.modifiedProfileGroup.members.includes(
							subject.id,
						),
				);

	const { inputTextError, submitBtnCSS } = getFormStatus(
		props.modifiedProfileGroup.title,
		props.type == "edit"
			? {
					type: "profileGroupEdit",
					profile: props.profile,
					profileGroup: props.modifiedProfileGroup,
					originalProfileGroup:
						props.profile.groupings[
							props.currEditingProfileGroupIndex
						],
				}
			: {
					type: "profileGroupAdd",
					profile: props.profile,
				},
	);

	function handleProfileGroupAdd() {
		updateNode({
			...props.profile,
			groupings: [...props.profile.groupings, props.modifiedProfileGroup],
		});
		props.onModifiedProfileGroup({
			title: "",
			description: "",
			members: [],
		});
		setSubjectSearchQuery("");
	}

	function handleProfileGroupEdit() {
		if (props.type == "edit") {
			updateNode({
				...props.profile,
				groupings: props.profile.groupings.map((group, i) => {
					if (i != props.currEditingProfileGroupIndex) {
						return group;
					} else {
						return props.modifiedProfileGroup;
					}
				}),
			});
		}
	}

	function handleProfileGroupMemberAdd(i: number) {
		props.onModifiedProfileGroup({
			...props.modifiedProfileGroup,
			members: [
				...props.modifiedProfileGroup.members,
				filteredSubjectSearches[i].id,
			],
		});
	}

	return (
		<fieldset
			className={`fieldset ${props.type == "add" ? "bg-base-200" : "bg-base-300"} border-base-300 rounded-box mt-4 border p-4`}
		>
			<legend className="fieldset-legend">
				{props.type == "add"
					? "Add a new Profile Group"
					: `Editing Profile Group: ${props.profile.groupings[props.currEditingProfileGroupIndex].title}`}
			</legend>

			<label className="label">Title</label>
			<div className="join">
				<input
					type="search"
					className="input join-item w-full"
					placeholder={
						props.type == "add" ? "New Profile Group" : undefined
					}
					maxLength={CONSTANTS.NUMS.INPUT_MAX}
					value={props.modifiedProfileGroup.title}
					onChange={(e) => {
						props.onModifiedProfileGroup({
							...props.modifiedProfileGroup,
							title: e.currentTarget.value,
						});
					}}
					onBlur={(e) => {
						props.onModifiedProfileGroup({
							...props.modifiedProfileGroup,
							title: formatString(e.currentTarget.value),
						});
					}}
				/>
				<button
					className={`btn ${submitBtnCSS} join-item rounded-r-full`}
					onClick={() =>
						props.type == "add"
							? handleProfileGroupAdd()
							: handleProfileGroupEdit()
					}
					disabled={submitBtnCSS == "btn-disabled"}
				>
					{props.type == "add" ? "+" : "Edit"}
				</button>
			</div>
			<span className="text-error">{inputTextError}</span>
			<label className="label mt-4">Description</label>
			<textarea
				className="textarea w-full"
				value={props.modifiedProfileGroup.description}
				onChange={(e) => {
					props.onModifiedProfileGroup({
						...props.modifiedProfileGroup,
						description: e.currentTarget.value,
					});
				}}
				maxLength={CONSTANTS.NUMS.TEXTAREA_MAX}
				rows={CONSTANTS.NUMS.TEXTAREA_ROW_MAX}
			/>

			{props.modifiedProfileGroup.members.length > 0 ? (
				<label className="label mt-4">
					{props.type == "add"
						? "Adding the following subjects to this group:"
						: "Members that belong to this group:"}
				</label>
			) : null}

			<ul className="list">
				{props.modifiedProfileGroup.members.map((id) => {
					const subject = tree.get(id);
					assertIsNonNull(subject);
					return (
						<li className="list-row" key={id}>
							{subject.name}
							<span
								className="ml-auto cursor-pointer"
								onClick={() =>
									props.onModifiedProfileGroup({
										...props.modifiedProfileGroup,
										members:
											props.modifiedProfileGroup.members.filter(
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
			{props.type == "edit" ? (
				<button
					className="btn btn-error"
					onClick={props.onCancelModify}
				>
					Cancel Changes
				</button>
			) : null}
		</fieldset>
	);
}
