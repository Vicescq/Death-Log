import { useState } from "react";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import type { Profile } from "../../model/tree-node-model/ProfileSchema";
import type { Subject } from "../../model/tree-node-model/SubjectSchema";
import { CONSTANTS } from "../../../shared/constants";
import { formatString } from "../../utils/general";

type Props = {
	profile: Profile;
	subjects: Subject[];
	type: "add" | "edit";
};

export default function DLPGModify({ type, profile, subjects }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);
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
						<ul className="list bg-base-200 max-h-96 overflow-auto rounded-4xl py-1">
							{filteredResults.map((subject) => (
								<li className="list-row">
									{subject.name}{" "}
									<button className="cursor-pointer text-end" type="button">
										+
									</button>
								</li>
							))}
						</ul>
					) : null}
				</>
			) : null}
		</>
	);
}
