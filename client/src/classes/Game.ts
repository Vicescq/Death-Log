import { v4 as uuid4 } from "uuid";
import TreeNode, { type TangibleTreeNodeParent } from "./TreeNode";
import type { TreeStateType } from "../contexts/treeContext";
import type Profile from "./Profile";

export default class Game extends TreeNode implements TangibleTreeNodeParent {

    constructor(
        name: string,
        path: string,
        parentID: string,
        childIDS: string[] = [],
        id: string = uuid4(),
        date: string | null = new Date().toString(),
        completed: boolean = false
    ) {
        super();
        this.name = name;
        this.type = "game";
        this.path = path;
        this.childIDS = childIDS
        this.id = id;
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
            const profile = tree.get(nodeID)! as Profile;
            count += profile.getFullTries(tree);
        })
        return count
    }

    getResets(tree: TreeStateType): number {
        let count = 0;
        this.childIDS.forEach((nodeID) => {
            const profile = tree.get(nodeID)! as Profile;
            count += profile.getResets(tree);
        })
        return count
    }
}