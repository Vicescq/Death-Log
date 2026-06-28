import { beforeEach, expect, test, vi } from "vitest";
import validJSON from "./test-files/valid-backup.json" with { type: "json" };
import invalidJSON from "./test-files/invalid-backup.json" with { type: "json" };
import { processImportedFile } from "./utils";
import LocalDB from "../../services/LocalDB";

vi.mock("../../services/LocalDB", () => {
	return {
		default: {
			clearAndInsertData: vi.fn().mockResolvedValue(undefined),
			dbVersion: vi.fn(() => 1),
		},
	};
});

beforeEach(() => {
	vi.clearAllMocks();
});

test("processImportedFile | happy path", async () => {
	const mockFile = new File(
		[JSON.stringify(validJSON)],
		"valid-backup.json",
		{ type: "application/json" },
	);
	await expect(processImportedFile(mockFile)).resolves.not.toThrow();
	expect(LocalDB.clearAndInsertData).toHaveBeenCalledOnce();
});

test("processImportedFile | error", async () => {
	const mockFile = new File(
		[JSON.stringify(invalidJSON)],
		"invalid-backup.json",
		{ type: "application/json" },
	);
	await expect(processImportedFile(mockFile)).rejects.toThrow("Invalid JSON");
	expect(LocalDB.clearAndInsertData).not.toHaveBeenCalled();
});

test("processImportedFile | error, non json", async () => {
	const mockFile = new File(
		[JSON.stringify(321321321312)],
		"invalid-backup.json",
		{ type: "application/json" },
	);
	await expect(processImportedFile(mockFile)).rejects.toThrow("Invalid JSON");
	expect(LocalDB.clearAndInsertData).not.toHaveBeenCalled();
});

test("processImportedFile | rejects a structurally-invalid node", async () => {
	const badNodeBackup = {
		...validJSON,
		data: [{ type: "game", id: "abc", name: "Elden Ring" }],
	};
	const mockFile = new File(
		[JSON.stringify(badNodeBackup)],
		"bad-node.json",
		{
			type: "application/json",
		},
	);
	await expect(processImportedFile(mockFile)).rejects.toThrow("Invalid JSON");
	expect(LocalDB.clearAndInsertData).not.toHaveBeenCalled();
});
