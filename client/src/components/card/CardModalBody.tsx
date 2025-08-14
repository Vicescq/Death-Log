import type { CardModalStateGame, CardModalStateProfile } from "../Modal";
import Toggle from "../Toggle";

type GameProps = {
	pageType: "Game";
	state: CardModalStateGame;
	handleModalToggle: (key: keyof CardModalStateGame) => void;
};

type ProfileProps = {
	pageType: "Profile";
	state: CardModalStateProfile;
	handleModalToggle: (key: keyof CardModalStateProfile) => void;
};

type SubjectProps = {
	pageType: "Subject";
	state: CardModalStateProfile;
	handleModalToggle: (key: keyof CardModalStateProfile) => void;
};

type Props = GameProps | ProfileProps | SubjectProps;

export default function CardModalBody({state, handleModalToggle}: Props) {
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
		</ul>
	);
}
