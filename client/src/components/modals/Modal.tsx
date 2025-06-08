import { ModalUtilityButton } from "./ModalUtilityButton";

export type ModalSchema =
	| "AddItemCard-Home"
	| "AddItemCard-Profile"
	| "AddItemCard-Subject"
	| "Card-Home"
	| "Card-Profile"
	| "Card-Subject";

type Props = {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	modalListItems: React.JSX.Element[];
	modalUtilityBtns: React.JSX.Element[];
};

export default function Modal({
	modalRef,
	modalListItems,
	modalUtilityBtns,
}: Props) {
	return (
		<dialog
			ref={modalRef}
			className="bg-zomp m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40"
		>
			<div className="flex flex-col gap-2">
				<ul className="flex flex-col">{modalListItems}</ul>
				{modalUtilityBtns}
				<ModalUtilityButton
					name="CLOSE"
					handleClick={() => modalRef.current?.close()}
					bgCol="bg-amber-200"
				/>
			</div>
		</dialog>
	);
}
