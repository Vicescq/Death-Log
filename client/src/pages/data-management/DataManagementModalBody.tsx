import type { DataManagementAction } from "./DataManagement";

type Props = {
	action: DataManagementAction;
	onImport: () => void;
	onDelete: () => void;
};

export default function DataManagementModalBody({
	action,
	onImport,
	onDelete,
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
					resets the app to a clean state, including any account that
					logged in here. Use this to remove your data or as a factory
					reset if the app isn't working. This cannot be undone.
				</div>
				<button onClick={onDelete} className="btn btn-error w-full">
					DELETE
				</button>
			</>
		);
	} else {
		return <div className="my-2">__DEV_ERROR__</div>;
	}
}
