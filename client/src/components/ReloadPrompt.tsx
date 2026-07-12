import { Link } from "react-router";

type Props = {
	onUpdate: () => void;
};

export default function ReloadPrompt({ onUpdate }: Props) {
	return (
		<div
			role="alert"
			className="alert alert-vertical alert-success sm:alert-horizontal rounded-none"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				className="h-6 w-6 shrink-0 stroke-current text-black"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<span>
				An update is available please click update. A manual refresh
				might not make this alert disappear! If the button is not
				working, clear your cache in
				<Link to="/data-management" className="link">
					{" "}
					Data Management.
				</Link>
			</span>
			<div>
				<button onClick={onUpdate} className="btn btn-sm">
					Update
				</button>
			</div>
		</div>
	);
}
