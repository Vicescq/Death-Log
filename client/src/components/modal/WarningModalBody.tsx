import { ForceError } from "../../pages/ErrorPage";

type Props = {
	msg: string;
	isReconfirm: boolean;
	isDeleteReconfirm: boolean;
	handleAction?: (goBack: boolean) => void;
};

export default function WarningModalBody({
	msg,
	isReconfirm,
	handleAction,
	isDeleteReconfirm,
}: Props) {
	return (
		<>
			<p className="max-w-lg break-words">Warning: {msg}</p>
			{isReconfirm ? (
				isDeleteReconfirm ? (
					<button
						className="bg-raisinblack rounded-2xl border-4 border-black p-2 font-bold text-white shadow-[4px_4px_0px_rgba(0,0,0,1)]"
						onClick={() =>
							handleAction
								? handleAction(true)
								: console.error(
										"DEV ERROR! handleAction must be defined if isReconfirm is true",
									)
						}
					>
						DELETE
					</button>
				) : (
					<>
						<button
							className="bg-raisinblack rounded-2xl border-4 border-black p-2 font-bold text-white shadow-[4px_4px_0px_rgba(0,0,0,1)]"
							onClick={() =>
								handleAction
									? handleAction(true)
									: console.error(
											"DEV ERROR! handleAction must be defined if isReconfirm is true",
										)
							}
						>
							GO BACK
						</button>
					</>
				)
			) : null}
		</>
	);
}

// You have unsaved changes! Click "CLOSE" to discard
// 							those changes, click "GO BACK" to edit/save them.
