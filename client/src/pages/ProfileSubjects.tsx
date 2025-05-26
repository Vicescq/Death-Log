import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import Subject, { type DeathType } from "../classes/Subject";
import ContextManager from "../classes/ContextManager";
import { useEffect, useState } from "react";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";
import { useAuth } from "@clerk/clerk-react";
import APIManager from "../classes/APIManager";

export default function ProfileSubjects({ profileID }: { profileID: string }) {

    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const userID = useAuth().userId;

    function handleAdd(inputText: string, autoDate: boolean = true) {
        UIHelper.handleAddHelper(inputText, tree, setTree, urlMap, setURLMap, autoDate, "subject", profileID);
    }

    function handleDelete(node: Subject) {
        ContextManager.deleteNode(tree, setTree, node, urlMap, setURLMap);
    }

    function handleDeathCount(subject: Subject, deathType: DeathType) {
        deathType == "fullTry" ? subject.fullTries++ : subject.resets++;
        const deepCopyTree = ContextManager.createDeepCopyTree(tree);
        deepCopyTree.set(subject.id, subject);
        setTree(deepCopyTree);
    }

    function subjectUI(subject: Subject) {
        return (
            <>
                <div className="flex gap-2">
                    <span className="rounded-md bg-amber-800 text-black m-auto p-1">Deaths: {subject.getDeaths()}</span>
                    <span className="rounded-md bg-sky-700 text-black m-auto p-1">Full Tries: {subject.fullTries}</span>
                    <span className="rounded-md bg-gray-700 text-black m-auto p-1"> Resets: {subject.resets}</span>
                </div>
                <button onClick={() => handleDeathCount(subject, "fullTry")} className="border-2 p-1 px-2 border-red-400 rounded-lg bg-red-400">+</button>
                <button onClick={() => handleDeathCount(subject, "reset")} className="border-2 p-1 border-red-400 rounded-lg bg-red-400">~ +</button>
            </>
        )
    }
    
    return (
        <>
            ProfileSubjects
            <AddItemCard handleAdd={handleAdd} itemType="subject" />
            {
                
                tree.get(profileID)?.childIDS.map((nodeID, index) => {
                    const subject = tree.get(nodeID) as Subject;
                    return <Card
                        key={index}
                        treeNode={subject}
                        handleDelete={() => handleDelete(subject)}
                        subjectUI={subjectUI(subject)}
                        subjectNotableCol={subject.notable ? null : "bg-green-900"}
                    />
                })
            }
        </>
    )
}