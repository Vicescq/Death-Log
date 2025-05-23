import TreeNode from "./TreeNode";

export default class RootNode extends TreeNode {
    constructor(
        childIDS: string[] = [],
        date: string = new Date().toString(),
    ) {
        super();
        this.id = "ROOT_NODE";
        this.parentID = null;
        this.childIDS = childIDS;
        this.date = date;
        this.type = "root";
    }
}