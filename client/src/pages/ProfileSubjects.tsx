import Card from "../components/Card";
import AddItemCard from "../components/AddItemCard";
import Subject, { type DeathType } from "../classes/Subject";
import ContextManager from "../classes/ContextManager";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import UIHelper from "../classes/UIHelper";
import Action from "../classes/Action";
import useHistoryContext from "../hooks/useHistoryContext";
import useSaveDeathLogStatus from "../hooks/useSaveDeathLogStatus";
import useCurrentHistoryIndex from "../hooks/useCurrentHistoryIndex";
import CardWrapper from "../components/CardWrapper";

export default function ProfileSubjects({ profileID }: { profileID: string }) {

    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const [history, setHistory] = useHistoryContext();

    const currentHistoryIndexRef = useCurrentHistoryIndex();

    function handleAdd(inputText: string, autoDate: boolean = true, notable: boolean = true) {
        const node = UIHelper.handleAddHelper(inputText, tree, autoDate, "subject", profileID, notable);
        ContextManager.addNodes(tree, setTree, urlMap, setURLMap, [node]);
        ContextManager.updateHistory(history, setHistory, new Action("add", [node]), new Action("update", [tree.get(profileID!)!]));
    }

    function handleDelete(node: Subject) {
        const bool = window.confirm();
        if (bool) {
            const deletedNodes = ContextManager.deleteNode(tree, setTree, node, urlMap, setURLMap);
            ContextManager.updateHistory(history, setHistory, new Action("delete", [...deletedNodes!]), new Action("update", [tree.get(node.parentID!)!]));
        }
    }

    function handleDeathCount(subject: Subject, deathType: DeathType) {
        const bool = window.confirm();
        if (bool) {
            let fullTries = 0, resets = 0;
            deathType == "fullTry" ? fullTries++ : resets++;
            const updatedSubject = new Subject(subject.name, subject.parentID!, subject.notable, subject.fullTries + fullTries, subject.resets + resets, subject.id, subject.date);
            ContextManager.updateNode(updatedSubject, tree, setTree);
            ContextManager.updateHistory(history, setHistory, new Action("update", [updatedSubject]));
        }
    }

    function subjectUI(subject: Subject) {
        return (
            <>
                <div className="flex gap-2">
                    <span className="p-2">Deaths: {subject.getDeaths()}</span>
                    <span className="p-2">Full Tries: {subject.fullTries}</span>
                    <span className="p-2"> Resets: {subject.resets}</span>
                </div>
                <button onClick={() => handleDeathCount(subject, "fullTry")} className="px-2 ">+</button>
                <button onClick={() => handleDeathCount(subject, "reset")} className="">~ +</button>
            </>
        )
    }

    function createCards() {
        return tree.get(profileID)?.childIDS.map((nodeID, index) => {
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

    useSaveDeathLogStatus(history, currentHistoryIndexRef);
    return (
        <>
            ProfileSubjects: TOTAL DEATHS: { }
            <AddItemCard handleAdd={handleAdd} itemType="subject" />
            <CardWrapper cards={createCards()}/>
        </>
    )
}