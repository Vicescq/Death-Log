import { v4 as uuid4 } from "uuid";
import TreeNode, { type TangibleTreeNodeParent } from "./TreeNode";
import type { TreeStateType } from "../contexts/treeContext";
import type Subject from "./Subject";

export default class Profile extends TreeNode implements TangibleTreeNodeParent{

    constructor(
        name: string,
        path: string,
        parentID: string,
        id: string = uuid4(),
        childIDS: string[] = [],
        date: string | null = new Date().toString(),
        completed: boolean = false
    ) {
        super();
        this.name = name;
        this.type = "profile";
        this.path = path;
        this.id = id;
        this.childIDS = childIDS
        this.date = date;
        this.parentID = parentID;
        this.completed = completed;
    }

    getDeaths(tree: TreeStateType): number {
        return this.getFullTries(tree) + this.getResets(tree);
    }

    getFullTries(tree: TreeStateType): number {
        let count = 0;
        this.childIDS.forEach((nodeID) => {
            const subject = tree.get(nodeID)! as Subject;
            count += subject.fullTries;
        })
        return count
    }

    getResets(tree: TreeStateType): number {
        let count = 0;
        this.childIDS.forEach((nodeID) => {
            const subject = tree.get(nodeID)! as Subject;
            count += subject.resets;
        })
        return count
    }
}