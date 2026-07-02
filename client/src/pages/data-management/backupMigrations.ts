export type RawNode = Record<string, unknown>;

type BackupMigration = (nodes: RawNode[]) => RawNode[];

const BACKUP_MIGRATIONS: Record<number, BackupMigration> = {
	1: (nodes) => nodes.map((node) => ({ ...node, isFake: false })),
};

export function migrateBackupNodes(
	nodes: RawNode[],
	fromVersion: number,
	toVersion: number,
): RawNode[] {
	let migrated = nodes;
	for (let v = fromVersion; v < toVersion; v++) {
		const migrate = BACKUP_MIGRATIONS[v];
		if (migrate) migrated = migrate(migrated);
	}
	return migrated;
}
