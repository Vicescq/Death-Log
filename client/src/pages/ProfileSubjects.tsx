import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import Subject from "../classes/Subject";
import ContextManager from "../classes/ContextManager";
import type { DeathType } from "../classes/Death";
import Death from "../classes/Death";
import { useState } from "react";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import type Profile from "../classes/Profile";

export default function ProfileSubjects({ profileID }: { profileID: string }) {

    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const [readOnly, setReadOnly] = useState(false);

    function onAdd(inputText: string) {
        if (inputText != "") {
            const node = tree.get(profileID)!;
            const currentProfile = node as Profile;
            const path = currentProfile.path + "/" + inputText.trim();
            const subject = new Subject(inputText.trim(), path, [...currentProfile.ancestry, currentProfile.id]);
            ContextManager.addNode(tree, setTree, subject, urlMap, setURLMap);
        }
    }


    console.log(profileID)

    return (
        <>
            ProfileSubjects
            <AddItemCard onAdd={onAdd} itemType="profile" />
            {
                tree.get(profileID)?.childIDS.map((nodeID, index) =>{
                    const subject = tree.get(nodeID) as Subject;
                    return <Card key={index} collectionNode={subject} onDelete={() => onDelete(subject)}/>
                })
            }
        </>
    )
}