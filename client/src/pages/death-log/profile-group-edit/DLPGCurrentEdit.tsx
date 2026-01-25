import { CONSTANTS } from "../../../../shared/constants";
import type { Profile } from "../../../model/TreeNodeModel";
import { formatString } from "../../../stores/utils";
import type { CurrentlyEditingProfileGroup } from "./DeathLogProfileGroup";

type Props = {
	profile: Profile;
	currentlyEditingProfileGroup: CurrentlyEditingProfileGroup;
	inputTextErrorCurrentGroup: string;
	submitBtnCSSCurrentGroup: "btn-disabled" | "btn-success";
	onEditSubmit: () => void;
	onUpdateCurrentlyEditingProfileGroup: (
		profileGroup: CurrentlyEditingProfileGroup,
	) => void;
};

export default function DLPGCurrentEdit({
	profile,
	currentlyEditingProfileGroup,
	inputTextErrorCurrentGroup,
	submitBtnCSSCurrentGroup,
	onEditSubmit,
	onUpdateCurrentlyEditingProfileGroup,
}: Props) {
	return (
		<fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
			<legend className="fieldset-legend">
				Currently Editing:{" "}
				{profile.groupings[currentlyEditingProfileGroup.index].title}
			</legend>

			<label className="label">Title</label>
			<input
				type="search"
				className="input w-full"
				value={currentlyEditingProfileGroup.profileGroup.title}
				onChange={(e) => {
					onUpdateCurrentlyEditingProfileGroup({
						...currentlyEditingProfileGroup,
						profileGroup: {
							...currentlyEditingProfileGroup.profileGroup,
							title: e.currentTarget.value,
						},
					});
				}}
				onBlur={(e) => {
					onUpdateCurrentlyEditingProfileGroup({
						...currentlyEditingProfileGroup,
						profileGroup: {
							...currentlyEditingProfileGroup.profileGroup,
							title: formatString(e.currentTarget.value),
						},
					});
				}}
			/>
			<span className="text-error">{inputTextErrorCurrentGroup}</span>

			<label className="label mt-4">Description</label>
			<textarea
				className="textarea w-full"
				value={currentlyEditingProfileGroup.profileGroup.description}
				onChange={(e) => {
					onUpdateCurrentlyEditingProfileGroup({
						...currentlyEditingProfileGroup,
						profileGroup: {
							...currentlyEditingProfileGroup.profileGroup,
							description: e.currentTarget.value,
						},
					});
				}}
				maxLength={CONSTANTS.TEXTAREA.TEXTAREA_MAX}
				rows={CONSTANTS.TEXTAREA.TEXTAREA_ROWS}
			/>
			<button
				className={`btn ${submitBtnCSSCurrentGroup} mt-2`}
				disabled={submitBtnCSSCurrentGroup == "btn-disabled"}
				onClick={onEditSubmit}
			>
				Confirm Edits
			</button>
		</fieldset>
	);
}
