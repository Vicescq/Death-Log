import z from "zod";
import type { DistinctTreeNode } from "../../model/tree-node-model/TreeNodeSchema";
import { DistinctTreeNodeShapeSchema } from "../../model/tree-node-model/DistinctTreeNodeShapeSchema";
import { migrateBackupNodes } from "./backupMigrations";
import LocalDB from "../../services/LocalDB";
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

type DeathLogBackup = {
	type: "DEATH-LOG Backup";
	version: number;
	details: typeof BACKUP_DETAILS;
	date: string;
	data: DistinctTreeNode[];
};

type DeathLogBackupWrapper = {
	name: string;
	json: DeathLogBackup;
};

export async function processImportedFile(importedFile: File) {
	const envelope = DeathLogBackupEnvelopeSchema.safeParse(
		JSON.parse(await importedFile.text()),
	);
	if (!envelope.success) {
		throw new Error("Invalid JSON");
	}

	const currentVersion = LocalDB.dbVersion();
	if (envelope.data.version > currentVersion) {
		throw new Error("Invalid JSON");
	}

	const migratedNodes = migrateBackupNodes(
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

export async function createDeathLogBackup(): Promise<DeathLogBackupWrapper> {
	const date = new Date();
	const iso = date.toISOString();
	const nodes = await LocalDB.getNodes();
	const finalJSON: DeathLogBackup = {
		type: "DEATH-LOG Backup",
		version: LocalDB.dbVersion(),
		details:
			"Please do not edit this JSON in a significant way. Doing so might corrupt the data and importing this file in the site will no longer work.",
		date: iso,
		data: nodes,
	};

	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const fileName = `Death Log ${year}_${addLeadingZeroes(month)}_${addLeadingZeroes(day)} ${date.toTimeString()}`;
	return { name: fileName, json: finalJSON };
}

export function formatBytes(bytes: number): string {
	const mb = bytes / 1024 ** 2;
	return `${mb.toFixed(1)} MB`;
}

export function barColor(percentage: number): string {
	if (percentage >= 90) return "progress-error";
	if (percentage >= 70) return "progress-warning";
	return "progress-primary";
}
