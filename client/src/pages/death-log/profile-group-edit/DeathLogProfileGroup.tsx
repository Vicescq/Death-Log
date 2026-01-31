import NavBar from "../../../components/navBar/NavBar";
import type { Profile } from "../../../model/TreeNodeModel";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../../utils";
import DeathLogBreadcrumb from "../DeathLogBreadcrumb";
import DLPGModify from "./DLPGModify";
import DLPGList from "./DLPGList";
import { useState } from "react";

type Props = {
	profile: Profile;
};

export default function DeathLogProfileGroup({ profile }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);

	const subjects = profile.childIDS.map((id) => {
		const subject = tree.get(id);
		assertIsNonNull(subject);
		assertIsSubject(subject);
		return subject;
	});

	const [
		currentlyEditingProfileGroupIndex,
		setCurrentlyEditingProfileGroupIndex,
	] = useState<number | null>(null);

	function handleDelete(i: number) {
		updateNode(profile, {
			...profile,
			groupings: profile.groupings.filter((_, index) => i != index),
		});
		setCurrentlyEditingProfileGroupIndex(null);
	}

	function handleEditFocus(i: number) {
		if (i == currentlyEditingProfileGroupIndex) {
			setCurrentlyEditingProfileGroupIndex(null);
		} else {
			setCurrentlyEditingProfileGroupIndex(i);
		}
	}

	return (
		<>
			<NavBar
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>

			<div className="m-auto mb-8 w-[90%] lg:max-w-[45rem]">
				<h1 className="text-center text-4xl font-bold">
					{profile.name} Profile Groups
				</h1>

				<DLPGList
					profile={profile}
					currentlyEditingProfileGroupIndex={
						currentlyEditingProfileGroupIndex
					}
					onDelete={handleDelete}
					onEditFocus={handleEditFocus}
				/>

				<DLPGModify
					profile={profile}
					subjects={subjects}
					type="add"
					currentlyEditingProfileGroupIndex={null}
				/>
				{currentlyEditingProfileGroupIndex != null ? (
					<DLPGModify
						profile={profile}
						subjects={subjects}
						type="edit"
						currentlyEditingProfileGroupIndex={
							currentlyEditingProfileGroupIndex
						}
					/>
				) : null}
			</div>
		</>
	);
}
