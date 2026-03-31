import type { DataManagementAction } from "./DataManagement";

type Props = {
	action: DataManagementAction;
	onImport: () => void;
	onDelete: () => void;
	onReset: () => void;
	onMigrate: () => void;
};

export default function DataManagementModalBody({
	action,
	onImport,
	onDelete,
	onReset,
	onMigrate,
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
					Are you sure you want to clear all your data for the current
					account? Guest data will be deleted if no account is logged
					in.
				</div>
				<button onClick={onDelete} className="btn btn-error w-full">
					DELETE
				</button>
			</>
		);
	} else if (action == "reset") {
		return (
			<>
				<div className="my-2">
					Resetting data will delete ALL Death Log data that was
					stored in this device. This includes any Death Log account
					that logged on this device, this acts as factory reset if
					the app does not work.
				</div>
				<button onClick={onReset} className="btn btn-error w-full">
					RESET
				</button>
			</>
		);
	} else {
		return (
			<>
				<div className="my-2">
					Do you want to migrate this guest account to a another (new
					or existing) account?
				</div>
				<button onClick={onMigrate} className="btn btn-info w-full">
					MIGRATE
				</button>
			</>
		);
	}
}
