import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import Subject from "../classes/Subject";
import ContextManager from "../classes/ContextManager";
import { useState } from "react";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import type Profile from "../classes/Profile";

export default function ProfileSubjects({ profileID }: { profileID: string }) {

    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const [readOnly, setReadOnly] = useState(false);

    function handleAdd(inputText: string) {
        if (inputText != "") {
            const node = tree.get(profileID)!;
            const currentProfile = node as Profile;
            const path = currentProfile.path + "/" + inputText.trim();
            const subject = new Subject(inputText.trim(), path, profileID);
            ContextManager.addNode(tree, setTree, subject, urlMap, setURLMap);
        }
    }

    function handleDelete(){

    }


    console.log(profileID)

    return (
        <>
            ProfileSubjects
            <AddItemCard handleAdd={handleAdd} itemType="profile" />
            {
                tree.get(profileID)?.childIDS.map((nodeID, index) =>{
                    const subject = tree.get(nodeID) as Subject;
                    return <Card key={index} collectionNode={subject} handleDelete={() => handleDelete(subject)}/>
                })
            }
        </>
    )
}