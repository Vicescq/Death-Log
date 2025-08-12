type Props = {
	name: string;
	handleClick: () => void;
	bgCol: string;
};

export default function Button({ name, handleClick, bgCol }: Props) {
	return (
		<button
			className={`${bgCol} rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-0`} onClick={handleClick}
		>
			{name}
		</button>
	);
}
