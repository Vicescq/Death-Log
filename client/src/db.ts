import Dexie, { type EntityTable, type Table } from 'dexie';
import type { DistinctTreeNode } from './model/TreeNodeModel';

export type CurrentUser = {
    uuid: string,
}

export type User = {
    uuid: string,
    email: string,
}

export type Node = {
    uuid: string,
    node_id: string,
    node: DistinctTreeNode,
}

export const db = new Dexie('DeathLogDB') as Dexie & {
    users: Table<User, 'uuid'>,
    nodes: Table<Node, 'node_id'>
};

db.version(1).stores({
    currentUser: "&uuid",
    users: "&uuid, email",
    nodes: "&node_id, uuid"
});
