import { Link } from "react-router";
import Toggle from "./Toggle";
import type { ToggleSetting, ToggleSettingsState } from "./AddItemCard";

type Props = {
	addItemCardModalRef: React.RefObject<HTMLDialogElement | null>;
	toggleSettingsState: ToggleSettingsState;
	handleToggleSetting: (setting: ToggleSetting, status: boolean) => void;
};

export default function AddItemCardToggleModal({
	addItemCardModalRef,
	toggleSettingsState,
	handleToggleSetting,
}: Props) {
	return (
		<dialog
			ref={addItemCardModalRef}
			className="bg-zomp m-auto border-4 border-black p-5 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40"
		>
			<div className="flex flex-col gap-4">
				<ul>
					<li className="m-2 flex gap-4">
						<Link to="#">Automatic Dates </Link>
						<div className="ml-auto">
							<Toggle
								enable={toggleSettingsState.get("autoDate")!}
								setting="autoDate"
								handleToggleSetting={handleToggleSetting!}
							/>
						</div>
					</li>

					{toggleSettingsState.get("challenge") != undefined ? (
						<li className="m-2 flex gap-4">
							<Link to="#">Challenge Profile</Link>
							<div className="ml-auto">
								<Toggle
									enable={
										toggleSettingsState.get("challenge")!
									}
									setting="challenge"
									handleToggleSetting={handleToggleSetting!}
								/>
							</div>
						</li>
					) : null}

					{toggleSettingsState.get("notable") != undefined ? (
						<li className="m-2 flex gap-4">
							<Link to="#">Notable</Link>
							<div className="ml-auto">
								<Toggle
									enable={toggleSettingsState.get("notable")!}
									setting="notable"
									handleToggleSetting={handleToggleSetting!}
								/>
							</div>
						</li>
					) : null}

					{toggleSettingsState.get("boss") != undefined ? (
						<li className="m-2 flex gap-4">
							<Link to="#">Boss</Link>
							<div className="ml-auto">
								<Toggle
									enable={toggleSettingsState.get("boss")!}
									setting="boss"
									handleToggleSetting={handleToggleSetting!}
								/>
							</div>
						</li>
					) : null}

					{toggleSettingsState.get("location") != undefined ? (
						<li className="m-2 flex gap-4">
							<Link to="#">Location</Link>
							<div className="ml-auto">
								<Toggle
									enable={
										toggleSettingsState.get("location")!
									}
									setting="location"
									handleToggleSetting={handleToggleSetting!}
								/>
							</div>
						</li>
					) : null}
				</ul>

				<button
					className="bg-hunyadi rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-0"
					onClick={() => console.log("PLACE INFO LINK HERE!")}
				>
					SETTINGS INFO
				</button>
				<button
					className="border- rounded-2xl border-4 bg-amber-200 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-0"
					onClick={() => addItemCardModalRef.current?.close()}
				>
					CLOSE
				</button>
			</div>
		</dialog>
	);
}
