const FORCE_PROD = false;
const FORCE_PROD_BACKUP_CONSTANTS = false;

export class DebugService {
	static readonly DEV = import.meta.env.DEV;

	static readonly ENABLED = DebugService.DEV && !FORCE_PROD;

	static readonly USE_DEV_BACKUP_CONSTANTS =
		DebugService.DEV && !FORCE_PROD_BACKUP_CONSTANTS;

	static forceDebugCondition(isForced: boolean) {
		return DebugService.DEV && isForced;
	}

	static log(...args: unknown[]) {
		if (DebugService.ENABLED) console.log(...args);
	}
}
