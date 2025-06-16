import Dexie, { type EntityTable, type Table } from 'dexie';
import type { DistinctTreeNode } from './model/TreeNodeModel';
import type { URLMapStateType } from './contexts/urlMapContext';

export type URLMapping = {
    node_id: string,
    email: string,
    mapping: {path: string, node_id: string},
}

export type Node = {
    email: string
    node_id: string,
    node: DistinctTreeNode,
}

export const db = new Dexie('DeathLogDB') as Dexie & {
    nodes: Table<Node, string>
    urlMaps: Table<URLMapping, string>
};

db.version(1).stores({
    nodes: "&node_id, email",
    urlMaps: "&node_id, email",
});
