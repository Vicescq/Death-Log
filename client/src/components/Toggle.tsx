import type { ToggleSetting } from "./AddItemCard";

type Props = {
	enable: boolean;
	setting: ToggleSetting;
	handleToggleSetting: (setting: ToggleSetting, status: boolean) => void;
};

export default function Toggle({
	enable,
	setting,
	handleToggleSetting,
}: Props) {
	const circleCSS = enable ? "translate-x-6" : null;
	const bgCSS = enable ? "bg-blue-700" : "bg-gray-700";

	return (
		<button
			className={`${bgCSS} h-8 w-14 rounded-2xl border-3 p-1 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)]`}
			onClick={() => handleToggleSetting(setting, !enable)}
		>
			<div
				className={`${circleCSS} h-4 w-4 transform rounded-2xl bg-white transition duration-300`}
			></div>
		</button>
	);
}
