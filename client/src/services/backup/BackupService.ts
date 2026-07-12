import z from "zod";
import type { DistinctTreeNode } from "../../model/tree-node-model/TreeNodeSchema";
import { DistinctTreeNodeShapeSchema } from "../../model/tree-node-model/DistinctTreeNodeShapeSchema";
import LocalDB from "../LocalDB";
import { addLeadingZeroes } from "../../utils/date";

const BACKUP_DETAILS =
	"Please do not edit this JSON in a significant way. Doing so might corrupt the data and importing this file in the site will no longer work.";

const DeathLogBackupEnvelopeSchema = z.strictObject({
	type: z.literal("DEATH-LOG Backup"),
	version: z.number(),
	details: z.literal(BACKUP_DETAILS),
	date: z.string(),
	data: z.array(z.record(z.string(), z.unknown())),
});

export type DeathLogBackup = {
	type: "DEATH-LOG Backup";
	version: number;
	details: typeof BACKUP_DETAILS;
	date: string;
	data: DistinctTreeNode[];
};

export type DeathLogBackupWrapper = {
	name: string;
	json: DeathLogBackup;
};

type RawNode = Record<string, unknown>;
type BackupMigration = (nodes: RawNode[]) => RawNode[];

const BACKUP_MIGRATIONS: Record<number, BackupMigration> = {
	1: (nodes) => nodes.map((node) => ({ ...node, isFake: false })),
};

export class BackupService {
	static async create(): Promise<DeathLogBackupWrapper> {
		const date = new Date();
		const iso = date.toISOString();
		const nodes = await LocalDB.getNodes();
		const finalJSON: DeathLogBackup = {
			type: "DEATH-LOG Backup",
			version: LocalDB.dbVersion(),
			details: BACKUP_DETAILS,
			date: iso,
			data: nodes,
		};

		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();

		const fileName = `Death Log ${year}_${addLeadingZeroes(month)}_${addLeadingZeroes(day)} ${date.toTimeString()}`;
		return { name: fileName, json: finalJSON };
	}

	static async restoreFromFile(file: File): Promise<void> {
		await BackupService.applyEnvelope(JSON.parse(await file.text()));
	}

	static async applyEnvelope(raw: unknown): Promise<void> {
		const envelope = DeathLogBackupEnvelopeSchema.safeParse(raw);
		if (!envelope.success) {
			throw new Error("Invalid JSON");
		}

		const currentVersion = LocalDB.dbVersion();
		if (envelope.data.version > currentVersion) {
			throw new Error("Invalid JSON");
		}

		const migratedNodes = BackupService.migrateBackupNodes(
			envelope.data.data,
			envelope.data.version,
			currentVersion,
		);

		const nodesResult = z
			.array(DistinctTreeNodeShapeSchema)
			.safeParse(migratedNodes);
		if (!nodesResult.success) {
			throw new Error("Invalid JSON");
		}

		await LocalDB.clearAndInsertData(nodesResult.data);
	}

	private static migrateBackupNodes(
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
}
