import { useState } from "react";
import type { Profile } from "../../model/tree-node-model/ProfileSchema";
import type { Subject } from "../../model/tree-node-model/SubjectSchema";
import { CONSTANTS } from "../../../shared/constants";

type Props = {
	profile: Profile;
	subjects: Subject[];
	type: "add" | "edit";
};

export default function DLPGModify({ type, profile, subjects }: Props) {
	const [searchQuery, setSearchQuery] = useState("");

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
						/>
					</label>

					<label className="floating-label">
						<span>Description</span>
						<textarea
							className="textarea w-full"
							placeholder="Group Description"
							rows={CONSTANTS.NUMS.TEXTAREA_ROW_MAX}
						/>
					</label>

					<span className="text-[1rem]">
						Adding the folowing members:{" "}
						<span className="text-error text-[1rem]">
							Nothing yet!
						</span>
					</span>

					<label className="floating-label">
						<span>Subject Search</span>
						<input
							type="search"
							className="input join-item w-full"
							placeholder="Search for Subjects"
							onChange={(e) =>
								setSearchQuery(e.currentTarget.value)
							}
						/>
					</label>
					{filteredResults.length > 0 ? (
						<ul className="list bg-base-300 max-h-96 overflow-auto rounded-2xl py-0.5">
							{filteredResults.map((subject) => (
								<li className="list-row">
									{subject.name}{" "}
									<button
										className="ml-auto cursor-pointer"
										type="button"
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
