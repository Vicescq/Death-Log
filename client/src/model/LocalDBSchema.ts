import Dexie, { type EntityTable, type Table } from 'dexie';
import type { DistinctTreeNode } from './TreeNodeModel';
import type { Event } from './EventModel';

type NodeEntry = {
    email: string,
    node_id: string,
    node: DistinctTreeNode,
    created_at: string,
    edited_at: string
}

type EventEntry = {
    id: number,
    email: string,
    event: Event,
    created_at: string,
    edited_at: string,
}

export type StateEntry = {
    id: string;
    email: string
    created_at: string;
    created_at_INT: number;
};

export type HistoryStateEntry = StateEntry & {
    auto_ID: number
};


type NonCachedGameEntry = {
    id: string
    email: string
}

export const db = new Dexie('DeathLogDB') as Dexie & {
    nodes: Table<NodeEntry, string>
    events: EntityTable<EventEntry, "id">
    eventStateHistory: EntityTable<HistoryStateEntry, "auto_ID">
    currentEventState: Table<StateEntry, string>
    nonCachedGames: Table<NonCachedGameEntry, string>
};

db.version(1).stores({
    nodes: "&node_id, email, created_at, edited_at",
    events: "++id, email, stateID, created_at, edited_at",
    eventStateHistory: "++auto_ID, id, email, created_at, created_at_INT",
    currentEventState: "&id, email, created_at, created_at_INT",
    nonCachedGames: "&id, email"
});
