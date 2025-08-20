import Toggle from "../Toggle";
import type { AddItemCardModalStateSubject } from "./AddItemCardTypes";
import SelectDropdown from "../SelectDropDown";

type GameProfileProps = {
	pageType: "gameORprofile"
	state?: never;
	handleModalToggle?: never
};

type SubjectProps = {
	pageType: "subject";
	state: AddItemCardModalStateSubject;
	handleModalToggle: (key: keyof AddItemCardModalStateSubject) => void;
};

type Props = GameProfileProps | SubjectProps;

export default function AddItemCardModalBody({ state }: Props) {
	return (
		<ul className="flex flex-col gap-2">
			<li className="flex gap-2 items-center">
				
				
			</li>
		</ul>
	);
}
