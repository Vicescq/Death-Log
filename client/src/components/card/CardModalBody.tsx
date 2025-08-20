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
	handleIsModalEdited: () => void;
	handleEdit: (overrides: CardModalStateGame) => void;
	handleModalToggle?: never;
};

type ProfileProps = {
	pageType: "profile";
	state: CardModalStateProfile;
	handleDelete: () => void;
	handleIsModalEdited: () => void;
	handleEdit: (overrides: CardModalStateProfile) => void;
	handleModalToggle?: never;
};

type SubjectProps = {
	pageType: "subject";
	state: CardModalStateSubject;
	handleModalToggle: (key: keyof CardModalStateSubject) => void;
	handleDelete: () => void;
	handleIsModalEdited: () => void;
	handleEdit: (overrides: CardModalStateSubject) => void;
};

type Props = GameProps | ProfileProps | SubjectProps;

export default function CardModalBody({
	pageType,
	state,
	handleDelete,
	handleIsModalEdited,
	handleEdit,
	handleModalToggle,
}: Props) {
	const [title, setTitle] = useState(state.name);
	return (
		<ul className="flex flex-col gap-2">
			<li className="flex items-center gap-2">
				<span>Title</span>
				<input
					type="text"
					className="rounded-2xl border-4 p-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					placeholder={title ? title : state.name}
					onChange={(e) => setTitle(e.currentTarget.value)}
				/>
			</li>

			<button
				className="bg-hunyadi rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
				onClick={() => handleIsModalEdited()}
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
