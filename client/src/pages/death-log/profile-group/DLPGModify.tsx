import { useState } from "react";
import type { Subject } from "../../../model/tree-node-model/SubjectSchema";
import { CONSTANTS } from "../../../../shared/constants";
import type { PGFormAdd } from "../formSchemas";
import type { UseFormReturn } from "react-hook-form";
import { assertIsNonNull } from "../../../utils/asserts";

type Props = {
	subjects: Subject[];
	type: "add" | "edit";
	form: UseFormReturn<PGFormAdd>;
	onMemberAdd: (id: string) => void;
	onMemberDelete: (index: number) => void;
	searchQuery: string;
	onChangeSearchQuery: (query: string) => void;
};

export default function DLPGModify({
	type,
	subjects,
	form,
	onMemberAdd,
	onMemberDelete,
	searchQuery,
	onChangeSearchQuery,
}: Props) {
	const members = form.getValues("members");
	const addedMembersFormattedForCompare = members.map((member) =>
		idToSubject(member.memberID).name.toLowerCase(),
	);
	const filteredMembers =
		searchQuery == ""
			? []
			: subjects.filter((subject) => {
					const formattedSubjectName = subject.name.toLowerCase();
					return (
						formattedSubjectName.includes(
							searchQuery.toLowerCase(),
						) &&
						!addedMembersFormattedForCompare.includes(
							formattedSubjectName,
						)
					);
				});

	function idToSubject(memberID: string) {
		const foundSubject = subjects.find((subject) => subject.id == memberID);
		assertIsNonNull(foundSubject);
		return foundSubject;
	}

	return (
		<>
			{type == "add" ? (
				<>
					<label className="floating-label">
						<span>Profile Group Name</span>

						<input
							type="search"
							className="input join-item w-full"
							placeholder="Add a new profiile group"
							{...form.register("title")}
						/>
					</label>
					{form.formState.errors.title && (
						<span className="text-error">
							{form.formState.errors.title.message}
						</span>
					)}

					<label className="floating-label">
						<span>Description</span>
						<textarea
							className="textarea w-full"
							placeholder="Group Description"
							rows={CONSTANTS.NUMS.TEXTAREA_ROW_MAX}
							{...form.register("description")}
						/>
					</label>
					{form.formState.errors.description && (
						<span className="text-error">
							{form.formState.errors.description.message}
						</span>
					)}

					<div>
						<span className="text-[1rem]">
							Adding the folowing members:{" "}
							{members.length == 0 ? (
								<span className="text-error text-[1rem]">
									Nothing yet!
								</span>
							) : null}
						</span>
						<ul className="list bg-base-300 max-h-96 overflow-auto rounded-2xl">
							{members.map((member, i) => (
								<li className="list-row" key={member.memberID}>
									{idToSubject(member.memberID).name}
									<button
										className="ml-auto cursor-pointer"
										type="button"
										onClick={() => onMemberDelete(i)}
									>
										✕
									</button>
								</li>
							))}
						</ul>
					</div>

					<label className="floating-label">
						<span>Subject Search</span>
						<input
							type="search"
							className="input join-item w-full"
							placeholder="Search for members"
							value={searchQuery}
							onChange={(e) =>
								onChangeSearchQuery(e.currentTarget.value)
							}
						/>
					</label>
					{filteredMembers.length > 0 ? (
						<ul className="list bg-base-300 max-h-96 overflow-auto rounded-2xl">
							{filteredMembers.map((subject) => (
								<li className="list-row" key={subject.id}>
									{subject.name}{" "}
									<button
										className="ml-auto cursor-pointer"
										type="button"
										onClick={() => onMemberAdd(subject.id)}
									>
										+
									</button>
								</li>
							))}
						</ul>
					) : searchQuery != "" ? (
						<span className="text-error text-center text-[1rem]">
							No results found!
						</span>
					) : null}
				</>
			) : (
				<>
					<div>dsasdsa</div>
				</>
			)}
		</>
	);
}
