import Toggle from "../Toggle";
import type {
	AddItemCardModalStateGame,
	AddItemCardModalStateProfile,
	AddItemCardModalStateSubject,
} from "./AddItemCardTypes";

type GameProps = {
	pageType: "Game";
	state: AddItemCardModalStateGame;
	handleModalToggle: (key: keyof AddItemCardModalStateGame) => void;
};

type ProfileProps = {
	pageType: "Profile";
	state: AddItemCardModalStateProfile;
	handleModalToggle: (key: keyof AddItemCardModalStateProfile) => void;
};

type SubjectProps = {
	pageType: "Subject";
	state: AddItemCardModalStateSubject;
	handleModalToggle: (key: keyof AddItemCardModalStateSubject) => void
};

type Props = GameProps | ProfileProps | SubjectProps;

export default function AddItemCardModalBody({
	handleModalToggle,
	state
}: Props) {
	
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
