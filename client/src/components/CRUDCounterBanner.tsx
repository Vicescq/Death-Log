import type { BackupNotify } from "../services/backup/BackupPolicy";

type Props = {
	backupNotify: BackupNotify;
	onDismiss: () => void;
};

const MESSAGES: Record<BackupNotify, () => string> = {
	never: () =>
		`You have never saved your Death Log. All of your changes live only on this device.`,
	stale: () => `It has been over a week since you last saved your Death Log.`,
	extreme: () =>
		`You have made a lot of changes since you last saved your Death Log.`,
};

export default function CRUDCounterBanner({ backupNotify, onDismiss }: Props) {
	return (
		<div
			role="alert"
			className="alert bg-primary text-primary-content alert-vertical alert-success sm:alert-horizontal justify-center rounded-none border-0 text-center text-sm"
		>
			<span>
				{MESSAGES[backupNotify]()} Export it or back it up to the cloud
				so a random browser or device data wipe cannot take it from you.
				<div className="mt-2">
					<button onClick={onDismiss} className="btn btn-sm w-20">
						Got It
					</button>
				</div>
			</span>
		</div>
	);
}
