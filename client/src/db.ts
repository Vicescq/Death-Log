import Dexie, { type EntityTable, type Table } from 'dexie';
import type { TreeNode } from './model/TreeNodeModel';

interface User {
    id: number;
    uuid: string;
    email: string;
}

interface Node {
    uuid: string;
    node_id: string;
    node: TreeNode,
}

const db = new Dexie('DeathLogDB') as Dexie & {
    users: Table<User, 'id'>,
    nodes: Table<Node, 'node_id'>
};

db.version(1).stores({
    users: "++id, &uuid, email",
    nodes: "&node_id, uuid"
});

export type { User, Node };
export { db };