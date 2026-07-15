import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import { BackupService } from "../services/backup/BackupService";
import { BackupPolicy } from "../services/backup/BackupPolicy";
import Backend from "../services/Backend";
import useDebug from "./useDebug";
import { DebugService } from "../services/DebugService";
import useOnlineStatus from "./useOnlineStatus";

export function useAutoBackup() {
	const isOnline = useOnlineStatus();
	const { isLoaded, isSignedIn, getToken } = useAuth();
	const queryClient = useQueryClient();

	const status = useDeathLogStore((state) => state.status);
	const count = useDeathLogStore((state) => state.crudState.count);
	const lastBackupMs = useDeathLogStore(
		(state) => state.crudState.lastBackup,
	);
	const autoBackup = useDeathLogStore((state) => state.crudState.autoBackup);
	const setAutoBackup = useDeathLogStore((state) => state.setAutoBackup);
	const resetCRUDCount = useDeathLogStore((state) => state.resetCRUDCount);

	const hasFakeData = useDeathLogStore((state) =>
		Array.from(state.tree.values()).some((node) => node.isFake),
	);

	const [failureCooldownUntil, setFailureCooldownUntil] = useState(0);

	const { mutate: createAutoBackup, isPending } = useMutation({
		mutationFn: async () => {
			const token = await getToken();
			if (!token) throw new Error();

			const backup = await BackupService.create();
			const res = await Backend.autoBackup(token, backup.json);
			if (!res.ok)
				throw new Error(res.status === 413 ? "TOO_LARGE" : "FAILED");
		},
		onSuccess: () => {
			resetCRUDCount();
			queryClient.invalidateQueries({ queryKey: ["backups"] });
		},
		onError: (error) => {
			if (error instanceof Error && error.message === "TOO_LARGE") {
				setAutoBackup(false);
				return;
			}
			// retryable: wait a longer cooldown before the next attempt
			setFailureCooldownUntil(
				Date.now() + BackupPolicy.FAILURE_COOLDOWN_MS,
			);
		},
	});

	const eligible =
		autoBackup &&
		status === "ready" &&
		isLoaded &&
		isSignedIn &&
		!hasFakeData &&
		count > 0 &&
		!isPending &&
		isOnline;

	// controlled via DebugService
	useDebug(autoBackup, "[autoBackup] autoBackup:", autoBackup);
	useDebug(status, "[autoBackup] status:", status);
	useDebug(isLoaded, "[autoBackup] isLoaded:", isLoaded);
	useDebug(isSignedIn, "[autoBackup] isSignedIn:", isSignedIn);
	useDebug(hasFakeData, "[autoBackup] hasFakeData:", hasFakeData);
	useDebug(count, "[autoBackup] count:", count);
	useDebug(isPending, "[autoBackup] isPending:", isPending);
	useDebug(eligible, "[autoBackup] ELIGIBLE:", eligible);
	useDebug(isOnline, "[autoBackup] isOnline:", isOnline);
	useDebug(lastBackupMs, "[autoBackup] lastBackupMs:", lastBackupMs);
	useDebug(
		failureCooldownUntil,
		"[autoBackup] failureCooldownUntil:",
		failureCooldownUntil,
	);

	useEffect(() => {
		if (!eligible) return;

		const delay = BackupPolicy.resolveDelay(
			lastBackupMs,
			failureCooldownUntil,
		);

		// controlled via DebugService
		let countdown: ReturnType<typeof setInterval> | undefined;
		if (BackupPolicy.USING_DEV_VALUES && DebugService.ENABLED) {
			const deadline = Date.now() + delay;
			countdown = setInterval(() => {
				const remainingSec = Math.round((deadline - Date.now()) / 1000);
				DebugService.log(`[autoBackup] firing in ${remainingSec}s`);
			}, 1000);
		}

		const timer = setTimeout(createAutoBackup, delay);

		return () => {
			clearTimeout(timer);
			clearInterval(countdown);
		};
	}, [eligible, count, createAutoBackup, lastBackupMs, failureCooldownUntil]);
}
