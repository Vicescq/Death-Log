import { ModalUtilityButton } from "./ModalUtilityButton";

type Props = {
	modalRef: React.RefObject<HTMLDialogElement | null>;
    msg: string
};

export type Alert = {
    msg: string,
    isAlert: boolean
}

export default function AlertModal({ modalRef, msg }: Props) {
	return (
		<dialog
			ref={modalRef}
			className="m-auto rounded-3xl border-4 border-black bg-orange-600 p-5 font-bold text-2xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40"
		>
			<div className="flex flex-col gap-4 p-4">
				<span>
					{msg}
				</span>
		

				<ModalUtilityButton
					name="CLOSE"
					handleClick={() => modalRef.current?.close()}
					bgCol="bg-amber-200"
				/>
	
			</div>
		</dialog>
	);
}
