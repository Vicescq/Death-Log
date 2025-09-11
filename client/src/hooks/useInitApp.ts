import { useEffect } from "react";
import LocalDB from "../services/LocalDB";
import { useTreeStore } from "../stores/useTreeStore";

export default function useInitApp() {

    const initTree = useTreeStore((state) => state.initTree);

    useEffect(() => {

        LocalDB.getNodes().then((nodes) => {
            initTree(nodes);
        }).catch((e) => {
            if (e instanceof Error) throw e
        })


    }, []);
}