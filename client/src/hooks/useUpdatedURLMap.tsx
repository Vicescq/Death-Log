import { useEffect } from "react";
import type Collection from "../classes/Collection";
import type { URLMapContextType, URLMapStateType, URLMapStateValueType } from "../context";
import type Game from "../classes/Game";

export default function useUpdatedURLMap<T>(games: Game[], stateRef: React.RefObject<Collection<T> | null>, urlMap: URLMapContextType[0], setURLMap: URLMapContextType[1], ...parentIDS: string[]) {

    // Rest param parentIDS must follow sequential order of the tree depth relating to its indices: game -> profile -> ... 

    useEffect(() => {
        if (stateRef.current) {


            const deepCopyURLMap: URLMapStateType = new Map();
            urlMap.forEach((value, key) => {
                deepCopyURLMap.set(key, value);
            });

            let urlMapValue: URLMapStateValueType;

            if (stateRef.current.type == "game") {
                urlMapValue = {
                    gameID: stateRef.current.id,
                    profileID: "",
                    subjectID: ""
                }
            }

            else if (stateRef.current.type == "profile") {
                urlMapValue = {
                    gameID: parentIDS[0],
                    profileID: stateRef.current.id,
                    subjectID: ""
                }
            }

            else {
                urlMapValue = {
                    gameID: parentIDS[0],
                    profileID: parentIDS[1],
                    subjectID: stateRef.current.id
                }
            }


            deepCopyURLMap.set(stateRef.current.path, urlMapValue);
            setURLMap(deepCopyURLMap)
        }
    }, [games]);
}