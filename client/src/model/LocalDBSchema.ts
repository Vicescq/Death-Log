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

db.version(2)
	.stores({
		nodes: "&node_id, created_at, edited_at, email",
	})
	.upgrade((tx) => {
		return tx
			.table("nodes")
			.toCollection()
			.modify((nodeEntry) => {
				if (nodeEntry.node.type == "subject") {
					const deaths = nodeEntry.node.deaths;
					delete nodeEntry.node.deaths;
					nodeEntry.node.log = [];
					for (let i = 0; i < deaths; i++) {
						nodeEntry.node.log.push({
							parentID: nodeEntry.node.id,
							timestamp: new Date().toISOString(),
							timestampRel: false,
							remark: null,
						});
					}
				}
			});
	});
