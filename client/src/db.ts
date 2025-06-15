import Dexie, { type EntityTable, type Table } from 'dexie';
import type { DistinctTreeNode } from './model/TreeNodeModel';
import type { URLMapStateType } from './contexts/urlMapContext';

export type URLMapping = {
    id: number
    email: string,
    mapping: {path: string, node_id: string},
}

export type Node = {
    email: string
    node_id: string,
    node: DistinctTreeNode,
}

export const db = new Dexie('DeathLogDB') as Dexie & {
    nodes: Table<Node, 'node_id'>
    urlMaps: EntityTable<URLMapping, 'id'>
};

db.version(1).stores({
    nodes: "&node_id, email",
    urlMaps: "++id, email",
});
