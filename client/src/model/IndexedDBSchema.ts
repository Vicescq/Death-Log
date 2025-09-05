import Dexie, { type EntityTable, type Table } from 'dexie';
import type { DistinctTreeNode, TreeNode } from './TreeNodeModel';

type Node = {
    email: string
    node_id: string,
    node: DistinctTreeNode,
    created_at: string,
    edited_at: string
}

type Event = {
    id: number
    email: string,
    event: Event,
    created_at: string,
    edited_at: string
}

export const db = new Dexie('DeathLogDB') as Dexie & {
    nodes: Table<Node, string>
    events: EntityTable<Event, "id">
};

db.version(1).stores({
    nodes: "&node_id, email, created_at, edited_at",
    events: "++id, email, created_at, edited_at"
});
