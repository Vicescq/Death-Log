import type { Game, Profile, Subject } from "../../model/TreeNodeModel";
import type { CardModalStateGame } from "./CardTypes";
import type { CardModalStateProfile, CardModalStateSubject } from "./CardTypes";
import SelectDropdown from "../SelectDropDown";
import Toggle from "../Toggle";
import { useState } from "react";

type GameProps = {
	pageType: "game";
	state: CardModalStateGame;
	handleDelete: () => void;
	handleModalEdit: (state: CardModalStateGame) => void;
	handleModalSave: (overrides: CardModalStateGame) => void;
};

type ProfileProps = {
	pageType: "profile";
	state: CardModalStateProfile;
	handleDelete: () => void;
	handleModalEdit: (state: CardModalStateProfile) => void;
	handleModalSave: (overrides: CardModalStateProfile) => void;
};

type SubjectProps = {
	pageType: "subject";
	state: CardModalStateSubject;
	handleDelete: () => void;
	handleModalEdit: (state: CardModalStateSubject) => void;
	handleModalSave: (overrides: CardModalStateSubject) => void;
};

type Props = GameProps | ProfileProps | SubjectProps;

export default function CardModalBody({
	pageType,
	state,
	handleDelete,
	handleModalEdit,
	handleModalSave,
}: Props) {
	return (
		<ul className="flex flex-col gap-2">
			<li className="flex items-center gap-2">
				<span>Title</span>
				<input
					type="text"
					className="rounded-2xl border-4 p-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					onChange={(e) =>
						handleModalEdit({
							name: e.currentTarget.value,
						} as CardModalStateGame &
							CardModalStateProfile &
							CardModalStateSubject)
					}
				/>
			</li>

			<button
				className="bg-hunyadi rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
				onClick={() => {
					// so ts doesnt show any errors
					handleModalSave(state as any);
				}}
			>
				SAVE
			</button>
			<button
				className="rounded-2xl border-4 bg-orange-700 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
				onClick={handleDelete}
			>
				DELETE
			</button>
		</ul>
	);
}
