import type { ToggleSetting } from "./modals/ModalListItemToggle";

type Props = {
	enable: boolean;
	handleToggle: () => void;
	setting: ToggleSetting;
};

export default function Toggle({ enable, setting, handleToggle }: Props) {
	const circleMovement = enable ? "translate-x-4" : null;
	let bgCSS = enable ? "bg-blue-700" : "bg-gray-700";

	return (
		<button
			className={`${bgCSS} h-8 w-12 rounded-full border-3 p-1 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)]`}
			onClick={() => handleToggle()}
		>
			<div
				className={`${circleMovement} h-4 w-4 transform rounded-full bg-white transition duration-300 ease-in-out`}
			></div>
		</button>
	);
}
