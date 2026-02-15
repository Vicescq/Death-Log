import { useState } from "react";
import { CONSTANTS } from "../../../../../shared/constants";
import { formatString } from "../../../../utils/general";
import { assertIsNonNull } from "../../../../utils/asserts";
import { useDeathLogStore } from "../../../../stores/useDeathLogStore";
import type {
	Profile,
	ProfileGroup,
} from "../../../../model/tree-node-model/ProfileSchema";
import type { Subject } from "../../../../model/tree-node-model/SubjectSchema";

type Props = {
	profile: Profile;
	subjects: Subject[];
	type: "add" | "edit";
};

export default function DLPGModify({ type, profile, subjects }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredSearchQuery =
		searchQuery == ""
			? []
			: subjects.filter((subject) =>
					subject.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase()),
				);

	// const filteredSearchQuery =
	// 	searchQuery == ""
	// 		? []
	// 		: subjects.filter(
	// 				(subject) =>
	// 					subject.name
	// 						.toLowerCase()
	// 						.includes(searchQuery.toLowerCase()) &&
	// 					!props.modifiedProfileGroup.members.includes(
	// 						subject.id,
	// 					),
	// 			);

	function handleProfileGroupAdd() {
		// updateNode({
		// 	...props.profile,
		// 	groupings: [...props.profile.groupings, props.modifiedProfileGroup],
		// });
		// setSubjectSearchQuery("");
	}

	function handleProfileGroupEdit() {
		// if (props.type == "edit") {
		// 	updateNode({
		// 		...props.profile,
		// 		groupings: props.profile.groupings.map((group, i) => {
		// 			if (i != props.currEditingProfileGroupIndex) {
		// 				return group;
		// 			} else {
		// 				return props.modifiedProfileGroup;
		// 			}
		// 		}),
		// 	});
		// }
	}

	function handleProfileGroupMemberAdd(i: number) {
		// props.onModifiedProfileGroup({
		// 	...props.modifiedProfileGroup,
		// 	members: [
		// 		...props.modifiedProfileGroup.members,
		// 		filteredSubjectSearches[i].id,
		// 	],
		// });
	}

	return (
		<fieldset
			className={`fieldset ${type == "add" ? "bg-base-200" : "bg-base-300"} border-base-300 rounded-box mt-4 border p-4`}
		>
			<legend className="fieldset-legend">
				{/* {props.type == "add"
					? "Add a new Profile Group"
					: `Editing Profile Group: ${props.profile.groupings[props.currEditingProfileGroupIndex].title}`} */}
				Test
			</legend>

			<label className="floating-label">
				<span>Title</span>
				<div className="join w-full">
					<input
						type="search"
						className="input join-item w-full"
						placeholder={
							type == "add" ? "New Profile Group" : undefined
						}
					/>
					<button
						className={`btn btn-success join-item rounded-r-full`}
						// onClick={() =>
						// 	props.type == "add"
						// 		? handleProfileGroupAdd()
						// 		: handleProfileGroupEdit()
						// }
					>
						{type == "add" ? "+" : "Edit"}
					</button>
				</div>
			</label>

			{/* <span className="text-error">{inputTextError}</span> */}

			<label className="floating-label mt-4">
				<span>Description</span>
				<textarea
					className="textarea w-full"
					rows={CONSTANTS.NUMS.TEXTAREA_ROW_MAX}
				/>
			</label>

			{true ? (
				<label className="label mt-4">
					{type == "add"
						? "Adding the following subjects to this group:"
						: "Members that belong to this group:"}
				</label>
			) : null}

			<ul className="list">
				{[].map((id) => {
					const subject = tree.get(id);
					assertIsNonNull(subject);
					return (
						<li className="list-row" key={id}>
							{subject.name}
							<span
								className="ml-auto cursor-pointer"
								// onClick={() =>
								// 	props.onModifiedProfileGroup({
								// 		...props.modifiedProfileGroup,
								// 		members:
								// 			props.modifiedProfileGroup.members.filter(
								// 				(memberID) => memberID != id,
								// 			),
								// 	})
								// }
							>
								✕
							</span>
						</li>
					);
				})}
			</ul>

			<label className="floating-label mt-4">
				<span>Search and Add subjects</span>
				<input
					type="search"
					placeholder="Search for subjects to add"
					className="input w-full"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.currentTarget.value)}
				/>
			</label>

			<ul className="list max-h-[30rem] overflow-auto">
				{searchQuery != "" && filteredSearchQuery.length != 0 ? (
					filteredSearchQuery.map((subject) => {
						return (
							<li className="list-row" key={subject.id}>
								{subject.name}{" "}
								<span
									className="ml-auto hover:cursor-pointer"
									// onClick={() =>
									// 	handleProfileGroupMemberAdd(i)
									// }
								>
									+
								</span>
							</li>
						);
					})
				) : searchQuery != "" ? (
					<span className="text-error">
						No matching names have been found!
					</span>
				) : null}
			</ul>

			{/* {props.type == "edit" ? (
				<button
					className="btn btn-error"
					onClick={props.onCancelModify}
				>
					Cancel Changes
				</button>
			) : null} */}
		</fieldset>
	);
}
