import Dexie, { type EntityTable, type Table } from 'dexie';
import type { DistinctTreeNode } from './model/TreeNodeModel';

export type CurrentUser = {
    email: string,
}

export type User = {
    email: string,
}

export type Node = {
    email: string
    node_id: string,
    node: DistinctTreeNode,
}

export const db = new Dexie('DeathLogDB') as Dexie & {
    currentUser: Table<CurrentUser, 'email'>
    users: Table<User, 'email'>,
    nodes: Table<Node, 'node_id'>
};

db.version(1).stores({
    currentUser: "&email",
    users: "&email",
    nodes: "&node_id, email"
});
