import { useState } from "react";
import type { CloudBackupSummary } from "../../model/DTOs/cloud-backup";
import { formatBytes } from "../../utils/general";

type Props = {
	backups: CloudBackupSummary[];
	onLoad: (backup: CloudBackupSummary) => void;
	onDelete: (backup: CloudBackupSummary) => void;
	loadingKey: string | null;
	deletingKey: string | null;
};

function formatBackupDate(iso: string): string {
	return new Date(iso).toLocaleString(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

export function backupKey(backup: CloudBackupSummary): string {
	return `${backup.auto ? "auto" : "manual"}-${backup.id}`;
}

export default function CloudBackups({
	backups,
	onLoad,
	onDelete,
	loadingKey,
	deletingKey,
}: Props) {
	const [deleteMode, setDeleteMode] = useState(false);
	const busy = loadingKey !== null || deletingKey !== null;

	return (
		<div className="bg-base-200 rounded-2xl p-4">
			<h2 className="mb-1 text-lg font-semibold">Cloud backups</h2>

			<p className="mb-3 list-disc text-sm opacity-80">
				Note that version numbers like "v2" or "v3" etc. are only
				relevent to the state of the appilication.
			</p>

			{backups.length > 0 && (
				<div className="mb-3 flex items-center justify-between">
					<span className="text-error font-semibold">
						Delete Mode
					</span>
					<input
						type="checkbox"
						className="toggle toggle-error"
						checked={deleteMode}
						onChange={(e) => setDeleteMode(e.target.checked)}
						aria-label="Toggle delete mode"
					/>
				</div>
			)}

			{backups.length === 0 ? (
				<p className="text-sm opacity-70">
					No cloud backups yet. Use "Back up to cloud" below to create
					one.
				</p>
			) : (
				<div className="flex flex-col gap-2">
					{backups.map((backup) => {
						const key = backupKey(backup);
						return (
							<div
								key={key}
								className="bg-base-100 flex items-center justify-between gap-3 rounded-lg p-3"
							>
								<div className="flex min-w-0 flex-col gap-1">
									<span className="text-sm opacity-80">
										{formatBackupDate(backup.date)}
									</span>
									<div className="flex gap-2">
										<span className="badge badge-primary badge-sm">
											{formatBytes(backup.sizeBytes)}
										</span>
										<span className="badge badge-accent badge-sm">
											v{backup.version}
										</span>
										{backup.auto && (
											<span className="badge badge-info badge-sm">
												auto
											</span>
										)}
									</div>
								</div>

								{deleteMode ? (
									<button
										className="btn btn-error"
										onClick={() => onDelete(backup)}
										disabled={busy}
									>
										{deletingKey === key
											? "Deleting..."
											: "Delete"}
									</button>
								) : (
									<button
										className="btn btn-info"
										onClick={() => onLoad(backup)}
										disabled={busy}
									>
										{loadingKey === key
											? "Loading..."
											: "Load"}
									</button>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
