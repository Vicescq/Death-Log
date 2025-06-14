import Dexie, { type EntityTable, type Table } from 'dexie';
import type { DistinctTreeNode } from './model/TreeNodeModel';

export type CurrentUser = {
    email: string,
}

export type Node = {
    email: string
    node_id: string,
    node: DistinctTreeNode,
}

export const db = new Dexie('DeathLogDB') as Dexie & {
    currentUser: Table<CurrentUser, 'email'>
    nodes: Table<Node, 'node_id'>
};

db.version(1).stores({
    currentUser: "&email",
    nodes: "&node_id, email"
});
