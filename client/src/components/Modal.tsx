import { Link } from "react-router";
import Toggle, { type ToggleSetting } from "./Toggle";

type ModalProps = {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	modalListItemStateArray: ModalListItemState[];
	handleToggleSetting: (setting: ToggleSetting, status: boolean, index: number) => void
};

export default function Modal({
	modalRef,
	modalListItemStateArray,
	handleToggleSetting
}: ModalProps) {
	return (
		<dialog
			ref={modalRef}
			className="bg-zomp m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40"
		>
			<div className="flex flex-col gap-2">
				<ul className="flex flex-col">
					{modalListItemStateArray?.map((state, index) => {
						return <ModalListItem key={index} index={index} modalListItemState={state} handleToggleSetting={handleToggleSetting}/>
					})}
				</ul>

				<ModalUtilityButton name="SAVE" />

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

type ModalUtilityButtonProps = {
	name: string;
	onClick?: () => void;
};

function ModalUtilityButton({ name, onClick }: ModalUtilityButtonProps) {
	return (
		<button
			className="bg-hunyadi rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-0"
			onClick={onClick}
		>
			{name}
		</button>
	);
}

export type ModalListItemState = {
	toggleSetting?: {
		enable: boolean;
		setting: ToggleSetting;
	};
	detailsSetting?: {
		setting: string;
		
	};
	filterSetting?: { [key: string]: any };
};

type ModalListItemProp = {
	modalListItemState: ModalListItemState;
	handleToggleSetting: (setting: ToggleSetting, status: boolean, index: number) => void,
	index: number
};

function ModalListItem({ modalListItemState, handleToggleSetting, index }: ModalListItemProp) {
	let content: React.JSX.Element | null = null;
	if (modalListItemState.toggleSetting) {
		content = (
			<>
				<Link to="#">{modalListItemState.toggleSetting.setting.toUpperCase()}</Link>
				<div className="ml-auto">
					<Toggle
						enable={modalListItemState.toggleSetting.enable}
						setting={modalListItemState.toggleSetting.setting}
						handleToggleSetting={
							handleToggleSetting
						}
						index={index}
					/>
				</div>
			</>
		);
	}

	return <li className="m-2 flex gap-4">{content}</li>;
}
