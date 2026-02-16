import { useState } from "react";
import { useDeathLogStore } from "../../../../stores/useDeathLogStore";
import type { Profile } from "../../../../model/tree-node-model/ProfileSchema";
import type { Subject } from "../../../../model/tree-node-model/SubjectSchema";
import { CONSTANTS } from "../../../../../shared/constants";

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
				</>
			) : null}
		</>
	);
}
