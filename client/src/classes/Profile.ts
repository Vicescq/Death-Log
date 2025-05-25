import { v4 as uuid4 } from "uuid";
import TreeNode from "./TreeNode";

export default class Profile extends TreeNode {

    constructor(
        name: string,
        path: string,
        parentID: string,
        id: string = uuid4(),
        childIDS: string[] = [],
        date: string | null = new Date().toString(),
    ) {
        super();
        this.name = name;
        this.type = "profile";
        this.path = path;
        this.id = id;
        this.childIDS = childIDS
        this.date = date;
        this.parentID = parentID;
    }
}