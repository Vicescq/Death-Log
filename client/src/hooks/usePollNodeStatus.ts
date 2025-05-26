import { useEffect } from "react";
import type { NodeEntry } from "../classes/APIManager";
import APIManager from "../classes/APIManager";

export default function usePollNodeStatus(newNodeEntriesRef: React.RefObject<NodeEntry[]>, deletedNodeIDSRef: React.RefObject<string[]>) {
    useEffect(() => {
        const interval = setInterval(() => {
            if (newNodeEntriesRef.current.length > 0) {
                
                APIManager.storeAddedNode(newNodeEntriesRef.current);
                newNodeEntriesRef.current = [];
                
            }
            if (deletedNodeIDSRef.current.length > 0){
                APIManager.removeDeletedNode(deletedNodeIDSRef.current);
                deletedNodeIDSRef.current = [];
            }

        }, 5000);
        return () => clearInterval(interval);
    }, []);
}