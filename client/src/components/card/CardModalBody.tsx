import type { Game, Profile, Subject } from "../../model/TreeNodeModel";
import type { CardModalStateGame } from "./CardTypes";
import type {
	CardModalStateProfile,
	CardModalStateSubject
} from "./CardTypes";
import SelectDropdown from "../SelectDropDown";
import Toggle from "../Toggle";

type GameProps = {
	pageType: "game";
	state: CardModalStateGame;
	handleDelete: () => void;
	handleEditedCardModal: (clickedBtn: "SAVE" | "CLOSE") => void;
	handleEdit: (overrides: CardModalStateGame) => void;
};

type ProfileProps = {
	pageType: "profile";
	state: CardModalStateProfile;
	handleDelete: () => void;
	handleEditedCardModal: (clickedBtn: "SAVE" | "CLOSE") => void;
	handleEdit: (overrides: CardModalStateProfile) => void;
};

type SubjectProps = {
	pageType: "subject";
	state: CardModalStateProfile;
	handleModalToggle: (key: keyof CardModalStateSubject) => void;
	handleDelete: () => void;
	handleEditedCardModal: (clickedBtn: "SAVE" | "CLOSE") => void;
	handleEdit: (overrides: CardModalStateSubject) => void;
};

type Props = GameProps | ProfileProps | SubjectProps;

export default function CardModalBody({
	pageType,
	state,
	handleDelete,
	handleEditedCardModal,
	handleEdit
}: Props) {

	return (
		<ul className="flex flex-col gap-2">
			<li className="flex items-center gap-2">
				<span>Title</span>
				<input
					type="text"
					className="rounded-2xl border-4 p-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
				/>
			</li>
			
			<button
				className="bg-hunyadi rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
				onClick={() => handleEditedCardModal("SAVE")}
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
