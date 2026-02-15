import { useDeathLogStore } from "../../../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../../../utils/asserts";
import { useState } from "react";
import DLPGList from "./DLPGList";
import DLPGModify from "./DLPGModify";
import type {
	Profile,
	ProfileGroup,
} from "../../../../model/tree-node-model/ProfileSchema";

type Props = {
	profile: Profile;
};

export default function DeathLogProfileGroup({ profile }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);

	function handleDelete(i: number) {
		updateNode({
			...profile,
			groupings: profile.groupings.filter((_, index) => i != index),
		});
		// if (i == currEditingProfileGroupIndex) {
		// 	setCurrEditingProfileGroupIndex(null);
		// 	setCurrEditingProfileGroup(null);
		// } else if (
		// 	currEditingProfileGroupIndex &&
		// 	i < currEditingProfileGroupIndex
		// ) {
		// 	const prevIndex = currEditingProfileGroupIndex;
		// 	setCurrEditingProfileGroupIndex(prevIndex - 1);
		// }
	}

	function handleEditFocus(i: number) {
		// if (i == currEditingProfileGroupIndex) {
		// 	setCurrEditingProfileGroupIndex(null);
		// } else {
		// 	setCurrEditingProfileGroupIndex(i);
		// 	setCurrEditingProfileGroup(profile.groupings[i]);
		// }
	}

	const subjects = profile.childIDS.map((id) => {
		const subject = tree.get(id);
		assertIsNonNull(subject);
		assertIsSubject(subject);
		return subject;
	});

	return (
		<>
			<DLPGList
				profile={profile}
				onDelete={handleDelete}
				onEditFocus={handleEditFocus}
			/>
			<DLPGModify profile={profile} subjects={subjects} type="add" />
		</>
	);
}
