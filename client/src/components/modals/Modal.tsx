import { useState } from "react";
import { createModalState } from "../../utils/ui";
import ModalListItemInputEdit from "./ModalListItemInputEdit";
import ModalListItemToggle from "./ModalListItemToggle";
import { ModalUtilityButton } from "./ModalUtilityButton";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";

export type ModalSchema =
	| "AddItemCard-Home"
	| "AddItemCard-Profile"
	| "AddItemCard-Subject"
	| "Card-Home"
	| "Card-Profile"
	| "Card-Subject";

type Props = {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	modalSchema: ModalSchema;
};

export default function Modal({ modalRef, modalSchema }: Props) {
	const [modalState, setModalState] = useState(createModalState(modalSchema));

	function createModalListItems() {
		return modalState.map((state, index) => {
			if (state.type == "inputEdit") {
				return (
					<ModalListItemInputEdit
						key={index}
						state={state}
						placeholder=""
					/>
				);
			} else if (state.type == "toggle") {
				return <ModalListItemToggle key={index} state={state} />;
			}
		});
	}

	function createModalUtilityButtons() {
		const utilityBtns: React.JSX.Element[] = [];
		switch (modalSchema) {
			case "Card-Home":
			case "Card-Profile":
			case "Card-Subject":
				utilityBtns.push(
					<ModalUtilityButton
						key={1}
						name="EDIT"
						handleClick={() => true}
						bgCol="bg-hunyadi"
					/>,
					<ModalUtilityButton
						key={2}
						name="DELETE"
						handleClick={() => true}
						bgCol="bg-red-500"
					/>,
				);
				break;
		}
		return utilityBtns;
	}

	useConsoleLogOnStateChange(modalState, modalState);

	return (
		<dialog
			ref={modalRef}
			className="bg-zomp m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40"
		>
			<div className="flex flex-col gap-2">
				<ul className="flex flex-col">{createModalListItems()}</ul>
				{createModalUtilityButtons()}
				<button
					className="border- rounded-2xl border-4 bg-amber-200 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-0"
					onClick={() => modalRef.current?.close()}
				>
					CLOSE
				</button>
			</div>
		</dialog>
	);
}
