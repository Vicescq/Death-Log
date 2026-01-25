import type { Profile } from "../../../model/TreeNodeModel";
import type { CurrentlyEditingProfileGroup } from "./DeathLogProfileGroup";
import edit from "../../../assets/edit.svg";

type Props = {
	profile: Profile;
	currentlyEditingProfileGroup: CurrentlyEditingProfileGroup | null;
	onEditFocus: (i: number) => void;
	onDelete: (i: number) => void;
};

export default function DLPGList({
	profile,
	currentlyEditingProfileGroup,
	onEditFocus,
	onDelete,
}: Props) {
	return (
		<fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
			<legend className="fieldset-legend">Profile Groups</legend>
			{profile.groupings.length == 0 ? (
				<span className="text-center">
					This current profile has no groups!
				</span>
			) : (
				<ul className="flex max-h-72 flex-col gap-2 overflow-auto">
					{profile.groupings.map((prfoileGroup, i) => {
						return (
							<li
								key={i}
								className={`hover:bg-neutral ${currentlyEditingProfileGroup?.index == i ? "bg-neutral" : ""} flex rounded-2xl px-4`}
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
									className="ml-auto cursor-pointer p-2"
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
