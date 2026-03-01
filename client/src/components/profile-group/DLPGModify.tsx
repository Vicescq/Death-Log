import { useState } from "react";
import type { Profile } from "../../model/tree-node-model/ProfileSchema";
import type { Subject } from "../../model/tree-node-model/SubjectSchema";
import { CONSTANTS } from "../../../shared/constants";
import type { PGFormAdd } from "../../pages/death-log/schema";
import type { UseFormReturn } from "react-hook-form";
import { assertIsNonNull } from "../../utils/asserts";

type Props = {
	profile: Profile;
	subjects: Subject[];
	type: "add" | "edit";
	form: UseFormReturn<PGFormAdd>;
	onMemberAdd: (id: string) => void;
};

export default function DLPGModify({
	type,
	profile,
	subjects,
	form,
	onMemberAdd,
}: Props) {
	const [searchQuery, setSearchQuery] = useState("");

	function findSubject(memberID: string) {
		const foundSubject = subjects.find((subject) => subject.id == memberID);
		assertIsNonNull(foundSubject);
		return foundSubject;
	}

	const filteredResults =
		searchQuery == ""
			? []
			: subjects.filter((subject) =>
					subject.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase()),
				);

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
							<span className="text-error text-[1rem]">
								Nothing yet!
							</span>
						</span>
						<ul className="list">
							{form.getValues("members").map((member) => (
								<li className="list-row">
									{findSubject(member.memberID).name}
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
							onChange={(e) =>
								setSearchQuery(e.currentTarget.value)
							}
						/>
					</label>
					{filteredResults.length > 0 ? (
						<ul className="list bg-base-300 max-h-96 overflow-auto rounded-2xl py-0.5">
							{filteredResults.map((subject) => (
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
						<span className="text-error text-center">
							No results found!
						</span>
					) : null}
				</>
			) : null}
		</>
	);
}
