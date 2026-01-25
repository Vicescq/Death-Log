import { CONSTANTS } from "../../../../shared/constants";
import type { ProfileGroup } from "../../../model/TreeNodeModel";
import { formatString } from "../../../stores/utils";

type Props = {
	newProfileGroup: ProfileGroup;
	onUpdateNewProfileGroup: (profileGroup: ProfileGroup) => void;
	inputTextError: string;
	submitBtnCSS: "btn-disabled" | "btn-success";
	searchedNames: string[];
	onUpdateSearchedNames: (searchedNames: string[]) => void;
	subjectsNames: string[];
	onAdd: () => void;
};

export default function DLPGAdd({
	newProfileGroup,
	onUpdateNewProfileGroup,
	inputTextError,
	submitBtnCSS,
	searchedNames,
	onUpdateSearchedNames,
	subjectsNames,
	onAdd,
}: Props) {
	return (
		<fieldset className="fieldset bg-base-200 border-base-300 rounded-box mt-4 border p-4">
			<legend className="fieldset-legend">Add a new Profile Group</legend>

			<label className="label">Title</label>
			<div className="join">
				<input
					type="search"
					className="input join-item w-full"
					placeholder="New Profile Group"
					maxLength={CONSTANTS.INPUT_MAX}
					value={newProfileGroup.title}
					onChange={(e) => {
						onUpdateNewProfileGroup({
							...newProfileGroup,
							title: e.currentTarget.value,
						});
					}}
					onBlur={(e) => {
						onUpdateNewProfileGroup({
							...newProfileGroup,
							title: formatString(e.currentTarget.value),
						});
					}}
				/>
				<button
					className={`btn ${submitBtnCSS} join-item rounded-r-full`}
					onClick={() => onAdd()}
					disabled={submitBtnCSS == "btn-disabled"}
				>
					+
				</button>
			</div>
			<span className="text-error">{inputTextError}</span>
			<label className="label mt-4">Description</label>
			<textarea
				className="textarea w-full"
				value={newProfileGroup.description}
				onChange={(e) => {
					onUpdateNewProfileGroup({
						...newProfileGroup,
						description: e.currentTarget.value,
					});
				}}
				maxLength={CONSTANTS.TEXTAREA.TEXTAREA_MAX}
				rows={CONSTANTS.TEXTAREA.TEXTAREA_ROWS}
			/>

			<label className="label mt-4">
				Adding the following subjects to this group:
			</label>
			<ul className="list">
				<li className="list-row">abc</li>
				<li className="list-row">abc</li>
				<li className="list-row">abc</li>
			</ul>

			<label className="label mt-4">Add subjects</label>
			<input
				type="search"
				placeholder="Search for subjects to add"
				className="input w-full"
				onChange={(e) => {
					if (e.currentTarget.value == "") {
						onUpdateSearchedNames([]);
					} else {
						onUpdateSearchedNames(
							subjectsNames.filter((name) =>
								name.includes(e.currentTarget.value),
							),
						);
					}
				}}
			/>
			<ul className="list">
				{searchedNames.map((name) => {
					return <li className="list-row">{name}</li>;
				})}
			</ul>
		</fieldset>
	);
}
