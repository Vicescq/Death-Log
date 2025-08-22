import Dexie, { type EntityTable, type Table } from 'dexie';
import type { TreeNode } from './TreeNodeModel';

export type Node = {
    email: string
    node_id: string,
    node: TreeNode,
    created_at: string
}

export const db = new Dexie('DeathLogDB') as Dexie & {
    nodes: Table<Node, string>
};

db.version(1).stores({
    nodes: "&node_id, email, created_at",
});
