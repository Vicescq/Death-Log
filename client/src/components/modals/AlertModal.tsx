import { ModalUtilityButton } from "./ModalUtilityButton";

type Props = {
	modalRef: React.RefObject<HTMLDialogElement | null>;
};

export default function AlertModal({ modalRef }: Props) {
	return (
		<dialog ref={modalRef} className="m-auto backdrop:backdrop-brightness-40">
			<ModalUtilityButton
				name="CLOSE"
				handleClick={() => modalRef.current?.close()}
				bgCol="bg-amber-200"
			/>
		</dialog>
	);
}
