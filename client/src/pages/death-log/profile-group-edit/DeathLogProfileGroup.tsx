import NavBar from "../../../components/navBar/NavBar";
import type { Profile, ProfileGroup } from "../../../model/TreeNodeModel";
import { useState } from "react";
import useConsoleLogOnStateChange from "../../../hooks/useConsoleLogOnStateChange";
import { getFormStatus, type GetFormStatusReturn } from "../utils";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../../utils";
import DeathLogBreadcrumb from "../DeathLogBreadcrumb";
import DLPGAdd from "./DLPGAdd";
import DLPGList from "./DLPGList";
import DLPGCurrentEdit from "./DLPGCurrentEdit";

type Props = {
	profile: Profile;
};

export type CurrentlyEditingProfileGroup = {
	profileGroup: ProfileGroup;
	index: number;
};

export default function DeathLogProfileGroup({ profile }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const subjectsNames = profile.childIDS.map((id) => {
		const subject = tree.get(id);
		assertIsNonNull(subject);
		assertIsSubject(subject);
		return subject.name;
	});
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const [newProfileGroup, setNewProfileGroup] = useState<ProfileGroup>({
		title: "",
		description: "",
		members: [],
	});
	const [currentlyEditingProfileGroup, setCurrentlyEditingProfileGroup] =
		useState<CurrentlyEditingProfileGroup | null>(null);

	const { inputTextError, submitBtnCSS } = getFormStatus(
		newProfileGroup.title,
		{
			type: "profileGroupAdd",
			profile: profile,
		},
	);

	const [searchedNames, setSearchedNames] = useState<string[]>([]);

	let inputTextErrorCurrentGroup = "";
	let submitBtnCSSCurrentGroup: GetFormStatusReturn["submitBtnCSS"] =
		"btn-disabled";
	if (currentlyEditingProfileGroup) {
		const currentlyEditingFormStatus = getFormStatus(
			currentlyEditingProfileGroup.profileGroup.title,
			{
				type: "profileGroupEdit",
				profile: profile,
				profileGroup: currentlyEditingProfileGroup.profileGroup,
				originalProfileGroup:
					profile.groupings[currentlyEditingProfileGroup.index],
			},
		);
		inputTextErrorCurrentGroup = currentlyEditingFormStatus.inputTextError;
		submitBtnCSSCurrentGroup = currentlyEditingFormStatus.submitBtnCSS;
	}

	function onAdd() {
		updateNode(profile, {
			...profile,
			groupings: [...profile.groupings, newProfileGroup],
		});
		setNewProfileGroup({
			title: "",
			description: "",
			members: [],
		});
	}

	function onEditFocus(i: number) {
		if (
			currentlyEditingProfileGroup?.profileGroup.title ==
			profile.groupings[i].title
		) {
			setCurrentlyEditingProfileGroup(null);
		} else {
			setCurrentlyEditingProfileGroup({
				index: i,
				profileGroup: profile.groupings[i],
			});
		}
	}

	function onEditSubmit() {
		updateNode(profile, {
			...profile,
			groupings: profile.groupings.map((group, i) => {
				if (
					currentlyEditingProfileGroup &&
					currentlyEditingProfileGroup.index == i
				) {
					return currentlyEditingProfileGroup.profileGroup;
				}
				return group;
			}),
		});
	}

	function onDelete(i: number) {
		if (currentlyEditingProfileGroup?.index == i) {
			setCurrentlyEditingProfileGroup(null);
		} else if (
			currentlyEditingProfileGroup &&
			currentlyEditingProfileGroup.index > i
		) {
			setCurrentlyEditingProfileGroup({
				...currentlyEditingProfileGroup,
				index: currentlyEditingProfileGroup.index - 1,
			});
		}
		updateNode(profile, {
			...profile,
			groupings: profile.groupings.filter((_, index) => i != index),
		});
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
					{profile.name}: Profile Groups
				</h1>

				<DLPGAdd
					onAdd={onAdd}
					inputTextError={inputTextError}
					submitBtnCSS={submitBtnCSS}
					searchedNames={searchedNames}
					newProfileGroup={newProfileGroup}
					onUpdateSearchedNames={(searchedNames) =>
						setSearchedNames(searchedNames)
					}
					onUpdateNewProfileGroup={(profileGroup) =>
						setNewProfileGroup(profileGroup)
					}
					subjectsNames={subjectsNames}
				/>

				<DLPGList
					currentlyEditingProfileGroup={currentlyEditingProfileGroup}
					onDelete={onDelete}
					onEditFocus={onEditFocus}
					profile={profile}
				/>

				{currentlyEditingProfileGroup ? (
					<DLPGCurrentEdit
						currentlyEditingProfileGroup={
							currentlyEditingProfileGroup
						}
						inputTextErrorCurrentGroup={inputTextErrorCurrentGroup}
						onEditSubmit={onEditSubmit}
						onUpdateCurrentlyEditingProfileGroup={(profileGroup) =>
							setCurrentlyEditingProfileGroup(profileGroup)
						}
						profile={profile}
						submitBtnCSSCurrentGroup={submitBtnCSSCurrentGroup}
					/>
				) : null}
			</div>
		</>
	);
}
