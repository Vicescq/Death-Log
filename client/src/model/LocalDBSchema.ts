import Dexie, { type Table } from "dexie";
import type { DistinctTreeNode } from "./tree-node-model/TreeNodeSchema";
import type { StatsView } from "./StatsViewSchema";

export type NodeEntry = {
	node_id: string;
	node: DistinctTreeNode;
	created_at: string;
	edited_at: string;
	email: string;
};

export type StatsViewEntry = {
	view_id: string;
	view: StatsView;
	created_at: string;
	edited_at: string;
	email: string;
};

export const db = new Dexie("DeathLogDB") as Dexie & {
	nodes: Table<NodeEntry, string>;
	views: Table<StatsViewEntry, string>;
};

db.version(1).stores({
	nodes: "&node_id, created_at, edited_at, email",
});

db.version(2).stores({
	nodes: "&node_id, created_at, edited_at, email",
	views: "&view_id, created_at, edited_at, email",
});
