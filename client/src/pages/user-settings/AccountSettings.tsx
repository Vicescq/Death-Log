import { useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth, useUser } from "@clerk/react";
import { UserProfile } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import Backend from "../../services/Backend";
import { BackupService } from "../../services/backup/BackupService";
import { BackupPolicy } from "../../services/backup/BackupPolicy";
import { formatBytes } from "../../utils/general";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import FeedbackToast, {
	type FeedbackToastState,
} from "../../components/FeedbackToast";
import Modal from "../../components/Modal";
import CloudBackups, { backupKey } from "./CloudBackups";
import {
	CloudBackupSummarySchema,
	type CloudBackupSummary,
} from "../../model/DTOs/cloud-backup";

const BACKUP_ERRORS: Record<string, string> = {
	TOO_LARGE:
		"Your death log is too large to back up to the cloud. Try exporting it locally from Data Management instead.",
	RATE_LIMITED:
		"You have backed up too many times recently. Please wait a few minutes and try again.",
	FAILED: "Could not back up right now. Please try again.",
};

export default function AccountSettings() {
	const { signOut, getToken } = useAuth();
	const { user } = useUser();
	const username = user?.username ?? "";
	const queryClient = useQueryClient();
	const refreshTree = useDeathLogStore((state) => state.refreshTree);
	const resetCRUDCount = useDeathLogStore((state) => state.resetCRUDCount);
	const autoBackup = useDeathLogStore((state) => state.crudState.autoBackup);
	const setAutoBackup = useDeathLogStore((state) => state.setAutoBackup);

	const [toast, setToast] = useState<FeedbackToastState>({
		displayed: false,
		msg: "",
		css: "success",
	});
	const [selectedBackup, setSelectedBackup] =
		useState<CloudBackupSummary | null>(null);
	const modalRef = useRef<HTMLDialogElement>(null);
	const backupModalRef = useRef<HTMLDialogElement>(null);
	const deleteModalRef = useRef<HTMLDialogElement>(null);

	const backupsQueryKey = ["backups", username];

	const {
		data: backups = [],
		isPending: backupsPending,
		isError: backupsError,
	} = useQuery({
		queryKey: backupsQueryKey,
		enabled: Boolean(username),
		queryFn: async ({ signal }) => {
			const token = await getToken();
			if (!token) throw new Error();

			const res = await Backend.getBackups(token, signal);
			if (!res.ok) throw new Error();

			const parsed = z
				.array(CloudBackupSummarySchema)
				.safeParse(await res.json());
			if (!parsed.success) throw new Error();

			return parsed.data;
		},
	});

	const backupMutation = useMutation({
		mutationFn: async () => {
			const token = await getToken();
			if (!token) throw new Error();

			const backup = await BackupService.create();
			const res = await Backend.backup(token, backup.json);
			if (!res.ok) {
				if (res.status === 413) throw new Error("TOO_LARGE");
				if (res.status === 429) throw new Error("RATE_LIMITED");
				throw new Error("FAILED");
			}
		},
		onSuccess: () => {
			resetCRUDCount();
			setToast({
				displayed: true,
				css: "success",
				msg: "Backup saved to the cloud!",
			});
			queryClient.invalidateQueries({ queryKey: backupsQueryKey });
		},
		onError: (error) => {
			const reason = error instanceof Error ? error.message : "FAILED";
			setToast({
				displayed: true,
				css: "error",
				msg: BACKUP_ERRORS[reason] ?? BACKUP_ERRORS.FAILED,
			});
		},
	});

	const restoreMutation = useMutation({
		mutationFn: async (backup: CloudBackupSummary) => {
			const token = await getToken();
			if (!token) throw new Error();

			const res = backup.auto
				? await Backend.getAutoBackupById(token, backup.id)
				: await Backend.getBackupById(token, backup.id);
			if (!res.ok) throw new Error();

			await BackupService.applyEnvelope(await res.json());
			await refreshTree();
		},
		onSuccess: () => {
			resetCRUDCount();
			setToast({
				displayed: true,
				css: "success",
				msg: "Backup restored to this device.",
			});
		},
		onError: () => {
			setToast({
				displayed: true,
				css: "error",
				msg: "Could not load that backup. Please try again.",
			});
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (backup: CloudBackupSummary) => {
			const token = await getToken();
			if (!token) throw new Error();

			const res = backup.auto
				? await Backend.deleteAutoBackupById(token, backup.id)
				: await Backend.deleteBackupById(token, backup.id);
			if (!res.ok) throw new Error();
		},
		onSuccess: () => {
			setToast({
				displayed: true,
				css: "success",
				msg: "Backup deleted.",
			});
			queryClient.invalidateQueries({ queryKey: backupsQueryKey });
		},
		onError: () => {
			setToast({
				displayed: true,
				css: "error",
				msg: "Could not delete that backup. Please try again.",
			});
		},
	});

	function handleLoad(backup: CloudBackupSummary) {
		setSelectedBackup(backup);
		modalRef.current?.showModal();
	}

	function handleDelete(backup: CloudBackupSummary) {
		setSelectedBackup(backup);
		deleteModalRef.current?.showModal();
	}

	function confirmRestore() {
		if (selectedBackup) restoreMutation.mutate(selectedBackup);
		modalRef.current?.close();
	}

	function confirmDelete() {
		if (selectedBackup) deleteMutation.mutate(selectedBackup);
		deleteModalRef.current?.close();
	}

	function confirmBackup() {
		backupMutation.mutate();
		backupModalRef.current?.close();
	}

	const restoringKey =
		restoreMutation.isPending && restoreMutation.variables
			? backupKey(restoreMutation.variables)
			: null;

	const deletingKey =
		deleteMutation.isPending && deleteMutation.variables
			? backupKey(deleteMutation.variables)
			: null;

	return (
		<>
			<FeedbackToast
				msg={toast.msg}
				bgCSS={toast.css}
				displayed={toast.displayed}
				onClose={() =>
					setToast((prev) => ({ ...prev, displayed: false }))
				}
			/>

			<Modal
				ref={modalRef}
				header="Confirm restore"
				closeBtnName="CANCEL"
				content={
					<div className="mt-4 space-y-4">
						<p>
							Load the backup from{" "}
							<span className="text-primary font-semibold underline">
								{selectedBackup
									? new Date(
											selectedBackup.date,
										).toLocaleString(undefined, {
											dateStyle: "medium",
											timeStyle: "short",
										})
									: ""}
							</span>
							? This will replace all Death Log data currently on
							this device and cannot be undone.
						</p>
						<p>
							Outdated versions will simply be migrated to a new
							version if possible.
						</p>
						<button
							className="btn btn-info w-full"
							onClick={confirmRestore}
						>
							Load backup
						</button>
					</div>
				}
			/>

			<Modal
				ref={backupModalRef}
				header="Confirm backup"
				closeBtnName="CANCEL"
				content={
					<div className="mt-4 space-y-4">
						<p>
							This saves a snapshot of your current Death Log to
							the cloud. Your five most recent manual backups are
							kept, separately from your auto backups.
						</p>
						<p>
							A single backup cannot exceed{" "}
							{formatBytes(
								BackupPolicy.CLOUD_BACKUP_LIMIT_BYTES_DISPLAY,
							)}
							. Past that the server rejects it and you will need
							to export locally from Data Management instead.
						</p>
						<button
							className="btn btn-info w-full"
							onClick={confirmBackup}
						>
							Back up now
						</button>
					</div>
				}
			/>

			<Modal
				ref={deleteModalRef}
				header="Confirm delete"
				closeBtnName="CANCEL"
				content={
					<div className="mt-4 space-y-4">
						<p>
							Permanently delete the backup from{" "}
							<span className="text-error font-semibold underline">
								{selectedBackup
									? new Date(
											selectedBackup.date,
										).toLocaleString(undefined, {
											dateStyle: "medium",
											timeStyle: "short",
										})
									: ""}
							</span>
							? This removes it from the cloud and cannot be
							undone. Your Death Log on this device is not
							touched.
						</p>
						<button
							className="btn btn-error w-full"
							onClick={confirmDelete}
						>
							Delete backup
						</button>
					</div>
				}
			/>

			<div className="bg-base-200 rounded-box mb-8 flex items-baseline gap-2 p-5">
				<div className="text-sm opacity-70">Signed in as</div>
				<div className="text-xl font-semibold">{user?.username}</div>
			</div>

			<div className="divider"></div>
			<div className="bg-base-200 flex items-center justify-center rounded-2xl p-6">
				<UserProfile />
			</div>
			<div className="divider"></div>

			<div className="bg-base-200 mb-4 flex items-center justify-between rounded-2xl p-4">
				<div>
					<p className="font-semibold">Auto backup</p>
					<p className="pr-4 text-sm opacity-70">
						Saves your Death Log to the cloud in the background,
						shortly after you stop making changes. It does not
						always run: see the{" "}
						<Link to="/FAQ" className="link link-primary">
							FAQ
						</Link>{" "}
						for the rules.
					</p>
				</div>
				<input
					type="checkbox"
					className="toggle toggle-info"
					checked={autoBackup}
					onChange={(e) => setAutoBackup(e.target.checked)}
					aria-label="Toggle auto backup"
				/>
			</div>

			<div className="mb-4">
				{backupsPending ? (
					<div className="bg-base-200 rounded-2xl p-4">
						Loading cloud backups...
					</div>
				) : backupsError ? (
					<div className="bg-base-200 rounded-2xl p-4">
						Could not load cloud backups.
					</div>
				) : (
					<CloudBackups
						backups={backups}
						onLoad={handleLoad}
						onDelete={handleDelete}
						loadingKey={restoringKey}
						deletingKey={deletingKey}
					/>
				)}
			</div>

			<div className="flex flex-col gap-4">
				<button
					className="btn btn-info text-xl"
					onClick={() => backupModalRef.current?.showModal()}
					disabled={backupMutation.isPending}
				>
					{backupMutation.isPending
						? "BACKING UP..."
						: "BACK UP TO CLOUD"}
				</button>

				<button
					className="btn btn-success text-xl"
					onClick={() => signOut({ redirectUrl: "/user-settings" })}
				>
					SIGN OUT
				</button>
			</div>
		</>
	);
}
