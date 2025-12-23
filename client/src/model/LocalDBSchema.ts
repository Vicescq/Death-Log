import Dexie, { type Table } from 'dexie';
import type { DistinctTreeNode } from './TreeNodeModel';
import { v4 as uuidv4 } from 'uuid';

type NodeEntry = {
    node_id: string,
    node: DistinctTreeNode,
    created_at: string,
    edited_at: string,
    email: string
}


export const db = new Dexie('DeathLogDB') as Dexie & {
    nodes: Table<NodeEntry, string>
};

db.version(1).stores({
    nodes: "&node_id, created_at, edited_at, email",
});

db.version(2).stores({
    nodes: "&node_id, created_at, edited_at, email",
}).upgrade(tx => {
    return tx.table("nodes").toCollection().modify(nodeEntry => {
        const uniquenessTracker = new Set()
        if (nodeEntry.node.urlID == undefined){
            let urlID;
            do {
                urlID = uuidv4().slice(0, 5)
                
            } while (uniquenessTracker.has(urlID))
            nodeEntry.node.urlID = uuidv4().slice(0, 5)
            uniquenessTracker.add(urlID)
        }
    })
});

db.version(3).stores({
    nodes: "&node_id, created_at, edited_at, email",
}).upgrade(tx => {
    return tx.table("nodes").toCollection().modify(nodeEntry => {
        const uniquenessTracker = new Set()
        let urlID;
        do {
            urlID = uuidv4().slice(0, 7)
        } while (uniquenessTracker.has(urlID))
        nodeEntry.node.urlID = urlID
        uniquenessTracker.add(urlID)
    })
});