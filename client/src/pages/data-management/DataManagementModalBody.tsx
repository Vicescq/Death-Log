import type { DataManagementAction } from "./DataManagement";

type Props = {
	action: DataManagementAction;
	onImport: () => void;
	onDelete: () => void;
	onSeed: () => void;
	onUndoFakeData: () => void;
	onKeepFakeData: () => void;
	onCacheClear: () => void;
};

export default function DataManagementModalBody({
	action,
	onImport,
	onDelete,
	onSeed,
	onUndoFakeData,
	onKeepFakeData,
	onCacheClear,
}: Props) {
	if (action == "import") {
		return (
			<>
				<div className="my-2">
					Importing a file will clear your current account data and
					will replace it with its contents. Do you want to proceed?
				</div>
				<button onClick={onImport} className="btn btn-info w-full">
					PROCEED
				</button>
			</>
		);
	} else if (action == "delete") {
		return (
			<>
				<div className="my-2">
					This deletes ALL Death Log data stored on this device and
					resets the app to a clean state. Use this to remove your
					data or as a factory reset if the app isn't working. This
					cannot be undone. This also clears the cache.
				</div>
				<button onClick={onDelete} className="btn btn-error w-full">
					DELETE
				</button>
			</>
		);
	} else if (action == "seed") {
		return (
			<>
				<div className="my-2">
					This overwrites any existing Death Log data on this device
					with generated sample data, so you can preview stats and
					charts. Use KEEP FAKE DATA afterward if you want to turn the
					sample data into permanent data instead of undoing it.
					<div className="text-warning mt-2">
						Auto backup pauses while sample data is on this device,
						so it can never reach your cloud backups. It resumes
						once you undo or keep the sample data.
					</div>
				</div>
				<button onClick={onSeed} className="btn btn-info w-full">
					PROCEED
				</button>
			</>
		);
	} else if (action == "undo") {
		return (
			<>
				<div className="my-2">
					This removes every generated sample game/profile/subject
					still marked as fake data (and anything added underneath
					it), leaving your real data untouched. This cannot be
					undone.
				</div>
				<button
					onClick={onUndoFakeData}
					className="btn btn-info w-full"
				>
					PROCEED
				</button>
			</>
		);
	} else if (action == "keep") {
		return (
			<>
				<div className="my-2">
					This turns any remaining sample data into permanent real
					data. Afterward, UNDO FAKE DATA will no longer be able to
					remove it.
				</div>
				<button
					onClick={onKeepFakeData}
					className="btn btn-info w-full"
				>
					PROCEED
				</button>
			</>
		);
	} else if (action == "cache") {
		return (
			<>
				<div className="my-2">
					Clears all cache data this device has for this app, do this
					if something does not work correctly. You can treat this as
					a soft reset for the app. Warning, do not clear the cache if
					you are offline! You will not be able to access the app
					again until you are online.
				</div>
				<button onClick={onCacheClear} className="btn btn-info w-full">
					PROCEED
				</button>
			</>
		);
	} else {
		return <div className="my-2">__DEV_ERROR__</div>;
	}
}
