import { type ToggleSetting } from "../Toggle";
import ModalListItem from "./ModalListItem";
import type {
	ModalListItemInputEdit,
	ModalListItemToggle,
} from "./ModalListItemTypes";
import { ModalUtilityButton } from "./ModalUtilityButton";

export type ModalParent = "card" | "addItemCard";

type ModalProps = {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	modalListItemArray: (ModalListItemInputEdit | ModalListItemToggle)[];
	handleToggleSetting?: (
		setting: ToggleSetting,
		status: boolean,
		index: number,
	) => void;
	handleDelete?: () => void;
	modalParent: ModalParent;
};

export default function Modal({
	modalRef,
	modalListItemArray,
	handleToggleSetting,
	handleDelete,
	modalParent,
}: ModalProps) {
	return (
		<dialog
			ref={modalRef}
			className="bg-zomp m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40"
		>
			<div className="flex flex-col gap-2">
				<ul className="flex flex-col">
					{modalListItemArray.map((li, index) => {
						return (
							<ModalListItem
								key={index}
								index={index}
								modalListItem={li}
								handleToggleSetting={handleToggleSetting}
							/>
						);
					})}
				</ul>
				{modalParent == "card" ? (
					<>
						<ModalUtilityButton
							name="DELETE"
							bgCol="bg-red-500"
							handleClick={handleDelete}
						/>
						<ModalUtilityButton name="SAVE" bgCol="bg-hunyadi" />
					</>
				) : null}

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
