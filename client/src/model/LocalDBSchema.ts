import Dexie, { type Table } from "dexie";
import type { DistinctTreeNode } from "./TreeNodeModel";

export type NodeEntry = {
	node_id: string;
	node: DistinctTreeNode;
	created_at: string;
	edited_at: string;
	email: string;
};

export const db = new Dexie("DeathLogDB") as Dexie & {
	nodes: Table<NodeEntry, string>;
};

db.version(1).stores({
	nodes: "&node_id, created_at, edited_at, email",
});
