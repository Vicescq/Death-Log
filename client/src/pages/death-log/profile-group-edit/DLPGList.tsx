import type { Profile, ProfileGroup } from "../../../model/TreeNodeModel";
import edit from "../../../assets/edit.svg";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { useState } from "react";

type Props = {
	profile: Profile;
};

export type CurrentlyEditingProfileGroup = {
	profileGroup: ProfileGroup;
	index: number;
};

export default function DLPGList({ profile }: Props) {
	const updateNode = useDeathLogStore((state) => state.updateNode);

	const [currentlyEditingProfileGroup, setCurrentlyEditingProfileGroup] =
		useState<CurrentlyEditingProfileGroup | null>(null);

	function onDelete(i: number) {
		updateNode(profile, {
			...profile,
			groupings: profile.groupings.filter((_, index) => i != index),
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

	return (
		<fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
			<legend className="fieldset-legend">Profile Groups</legend>
			{profile.groupings.length == 0 ? (
				<span className="text-center">
					This current profile has no groups!
				</span>
			) : (
				<ul className="list max-h-72 overflow-auto">
					{profile.groupings.map((prfoileGroup, i) => {
						return (
							<li
								key={i}
								className={`hover:bg-neutral list-row ${currentlyEditingProfileGroup?.index == i ? "bg-neutral" : ""} rounded-2xl`}
							>
								<label className="label">
									<button
										className={`btn btn-xs btn-ghost hover:bg-neutral hover:border-neutral ${currentlyEditingProfileGroup?.index == i ? "bg-neutral border-neutral" : ""} p-0`}
										onClick={() => onEditFocus(i)}
									>
										<img
											src={edit}
											alt=""
											className="w-4"
										/>
									</button>
									<span className="ml-2">
										{prfoileGroup.title}
									</span>
								</label>

								<button
									className="ml-auto cursor-pointer"
									onClick={() => onDelete(i)}
								>
									✕
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</fieldset>
	);
}
