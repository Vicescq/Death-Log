import { DebugService } from "../DebugService";
import type { CrudState } from "../../model/CrudStateSchema";

const DEV = DebugService.USE_DEV_CONSTANTS;

export type BackupNotify = "never" | "stale" | "extreme";

export class BackupPolicy {
	static readonly USING_DEV_VALUES = DEV;

	static readonly CRUD_COUNT_THRESHOLD = DEV ? 2 : 50;
	static readonly CRUD_COUNT_EXTREME_THRESHOLD = DEV ? 5 : 250;
	static readonly BACKUP_STALE_MS = DEV ? 30_000 : 7 * 24 * 60 * 60 * 1000; // one week

	static readonly DEBOUNCE_MS = DEV ? 5_000 : 2 * 60_000;
	static readonly LAST_BACKUP_DEBOUNCE_WINDOW_MS = DEV ? 20_000 : 30 * 60_000;
	static readonly FAILURE_COOLDOWN_MS = DEV ? 15_000 : 10 * 60_000;

	static readonly CLOUD_BACKUP_LIMIT_BYTES_DISPLAY = 10 * 1024 * 1024;

	static autoBackupActive(
		state: CrudState,
		signedIn: boolean,
		hasFakeData: boolean,
	): boolean {
		return state.autoBackup && signedIn && !hasFakeData;
	}

	static notify(
		state: CrudState,
		autoBackupActive: boolean,
	): BackupNotify | null {
		const staleBackup =
			state.count >= BackupPolicy.CRUD_COUNT_THRESHOLD &&
			Date.now() - state.lastBackup >= BackupPolicy.BACKUP_STALE_MS;

		const extremeActivity =
			state.count >= BackupPolicy.CRUD_COUNT_EXTREME_THRESHOLD;

		if (!staleBackup && !extremeActivity) return null;

		if (autoBackupActive) return null;

		if (state.lastBackup === 0) return "never";
		return extremeActivity ? "extreme" : "stale";
	}

	static resolveDelay(lastBackupMs: number, failureCooldownUntil = 0) {
		const now = Date.now();
		const computedLastBackupDebounceWindowMs =
			lastBackupMs + BackupPolicy.LAST_BACKUP_DEBOUNCE_WINDOW_MS - now;
		const computedFailureCooldownMs = failureCooldownUntil - now;
		return Math.max(
			BackupPolicy.DEBOUNCE_MS,
			computedLastBackupDebounceWindowMs,
			computedFailureCooldownMs,
		);
	}
}
