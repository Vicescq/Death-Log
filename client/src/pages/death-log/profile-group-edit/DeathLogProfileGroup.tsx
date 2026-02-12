import NavBar from "../../../components/navBar/NavBar";
import type { Profile, ProfileGroup } from "../../../model/TreeNodeModel";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../../utils/asserts";
import DeathLogBreadcrumb from "../breadcrumb/DeathLogBreadcrumb";
import DLPGModify from "./DLPGModify";
import DLPGList from "./DLPGList";
import { useState } from "react";

type Props = {
	profile: Profile;
};

export default function DeathLogProfileGroup({ profile }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);

	const [newProfileGroup, setNewProfileGroup] = useState<ProfileGroup>({
		title: "",
		description: "",
		members: [],
	});

	const [currEditingProfileGroup, setCurrEditingProfileGroup] =
		useState<ProfileGroup | null>({
			title: "",
			description: "",
			members: [],
		});
	const [currEditingProfileGroupIndex, setCurrEditingProfileGroupIndex] =
		useState<number | null>(null);

	function handleDelete(i: number) {
		updateNode({
			...profile,
			groupings: profile.groupings.filter((_, index) => i != index),
		});
		if (i == currEditingProfileGroupIndex) {
			setCurrEditingProfileGroupIndex(null);
			setCurrEditingProfileGroup(null);
		} else if (
			currEditingProfileGroupIndex &&
			i < currEditingProfileGroupIndex
		) {
			const prevIndex = currEditingProfileGroupIndex;
			setCurrEditingProfileGroupIndex(prevIndex - 1);
		}
	}

	function handleEditFocus(i: number) {
		if (i == currEditingProfileGroupIndex) {
			setCurrEditingProfileGroupIndex(null);
		} else {
			setCurrEditingProfileGroupIndex(i);
			setCurrEditingProfileGroup(profile.groupings[i]);
		}
	}

	const subjects = profile.childIDS.map((id) => {
		const subject = tree.get(id);
		assertIsNonNull(subject);
		assertIsSubject(subject);
		return subject;
	});

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
						currEditingProfileGroupIndex
					}
					onDelete={handleDelete}
					onEditFocus={handleEditFocus}
				/>

				{currEditingProfileGroupIndex != null &&
				currEditingProfileGroup != null ? (
					<DLPGModify
						profile={profile}
						subjects={subjects}
						type="edit"
						currEditingProfileGroupIndex={
							currEditingProfileGroupIndex
						}
						modifiedProfileGroup={currEditingProfileGroup}
						onModifiedProfileGroup={(profileGroup) =>
							setCurrEditingProfileGroup(profileGroup)
						}
						onCancelModify={() =>
							handleEditFocus(currEditingProfileGroupIndex)
						}
					/>
				) : null}

				<DLPGModify
					profile={profile}
					subjects={subjects}
					type="add"
					modifiedProfileGroup={newProfileGroup}
					onModifiedProfileGroup={(profileGroup) =>
						setNewProfileGroup(profileGroup)
					}
				/>
			</div>
		</>
	);
}
