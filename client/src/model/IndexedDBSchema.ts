import Dexie, { type EntityTable, type Table } from 'dexie';
import type { DistinctTreeNode, TreeNode } from './TreeNodeModel';
import type { Event } from './EventModel';

type NodeEntry = {
    email: string
    node_id: string,
    node: DistinctTreeNode,
    created_at: string,
    edited_at: string
}

type EventEntry = {
    id: number
    email: string,
    event: Event,
    created_at: string,
    edited_at: string
}

export const db = new Dexie('DeathLogDB') as Dexie & {
    nodes: Table<NodeEntry, string>
    events: EntityTable<EventEntry, "id">
};

db.version(1).stores({
    nodes: "&node_id, email, created_at, edited_at",
    events: "++id, email, created_at, edited_at"
});
