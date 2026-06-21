import type {
	DistinctTreeNode,
	TreeNode,
} from "../../model/tree-node-model/TreeNodeSchema";
import LocalDB from "../../services/LocalDB";
import { addLeadingZeroes } from "../../utils/date";

type DeathLogBackup = {
	type: "DEATH-LOG Backup";
	version: number;
	details: "Please do not edit this JSON in a significant way. Doing so might corrupt the data and importing this file in the site will no longer work.";
	date: string;
	data: DistinctTreeNode[];
};

type DeathLogBackupWrapper = {
	name: string;
	json: DeathLogBackup;
};

export async function processImportedFile(importedFile: File) {
	const importedFileTxt = await importedFile.text();
	const parsedJSON = JSON.parse(importedFileTxt);

	const deathLogBackupKeys = ["type", "version", "details", "date", "data"];
	const keys = Object.keys(parsedJSON);
	if (keys.length != deathLogBackupKeys.length) {
		throw new Error("Invalid JSON");
	}
	keys.forEach((key) => {
		if (!deathLogBackupKeys.includes(key)) {
			throw new Error("Invalid JSON");
		}
	});

	if (parsedJSON.type != "DEATH-LOG Backup") {
		throw new Error("Invalid JSON");
	}

	if (
		parsedJSON.details !=
		"Please do not edit this JSON in a significant way. Doing so might corrupt the data and importing this file in the site will no longer work."
	) {
		throw new Error("Invalid JSON");
	}

	// light validation!
	if (parsedJSON.data.length > 0) {
		parsedJSON.data.forEach((supposedNode: TreeNode) => {
			if (!(supposedNode.type && supposedNode.id && supposedNode.name))
				throw new Error("Invalid JSON");
		});
	}

	if (parsedJSON.version != LocalDB.dbVersion()) {
		throw new Error("Invalid JSON"); // temp
		// implement migrations
	}

	await LocalDB.clearAndInsertData(parsedJSON.data);
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
