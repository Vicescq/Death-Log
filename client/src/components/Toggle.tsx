export type ToggleSetting =
	| "challenge"
	| "notable"
	| "boss"
	| "location";

type Props = {
	enable: boolean;
	setting: ToggleSetting;
	handleToggleSetting: (
		status: boolean,
		index: number,
	) => void;
	index: number;
};

export default function Toggle({
	enable,
	setting,
	handleToggleSetting,
	index,
}: Props) {
	const circleCSS = enable ? "translate-x-4" : null;
	const bgCSS = enable ? "bg-blue-700" : "bg-gray-700";

	return (
		<button
			className={`${bgCSS} h-8 w-12 rounded-full border-3 p-1 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)]`}
			onClick={() => handleToggleSetting(!enable, index)}
		>
			<div
				className={`${circleCSS} h-4 w-4 transform rounded-full bg-white transition duration-300 ease-in-out`}
			></div>
		</button>
	);
}
