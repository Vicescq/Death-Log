import type { Game } from "../../model/TreeNodeModel";
import type { CardModalStateGame, CardModalStateProfile, CardModalStateSubject } from "../Modal";
import Toggle from "../Toggle";

type GameProps = {
	pageType: "game";
	state: CardModalStateGame;
	handleModalToggle: (key: keyof CardModalStateGame) => void;
	handleDelete: () => void;
	handleEditedCardModal: (clickedBtn: "SAVE" | "CLOSE") => void;
};

type ProfileProps = {
	pageType: "profile";
	state: CardModalStateProfile;
	handleModalToggle: (key: keyof CardModalStateProfile) => void;
	handleDelete: () => void;
	handleEditedCardModal: (clickedBtn: "SAVE" | "CLOSE") => void;
};

type SubjectProps = {
	pageType: "subject";
	state: CardModalStateProfile;
	handleModalToggle: (key: keyof CardModalStateSubject) => void;
	handleDelete: () => void;
	handleEditedCardModal: (clickedBtn: "SAVE" | "CLOSE") => void;
};

type Props = GameProps | ProfileProps | SubjectProps;

export default function CardModalBody({ state, handleModalToggle, handleDelete, handleEditedCardModal }: Props) {
	return (
		<ul className="flex flex-col gap-2">
			<li className="flex gap-2">
				<span className="mr-auto">Reliable Date (Start)</span>
				<Toggle
					enable={state["dateStartR"]}
					handleToggle={() => handleModalToggle("dateStartR")}
				/>
			</li>
			<li className="flex gap-2">
				<span className="mr-auto">Reliable Date (End)</span>
				<Toggle
					enable={state["dateEndR"]}
					handleToggle={() => handleModalToggle("dateEndR")}
				/>
			</li>
			<button
				className="rounded-2xl border-4 bg-hunyadi p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
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
