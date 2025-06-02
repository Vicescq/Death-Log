import TreeNode from "./TreeNode";

export default class RootNode extends TreeNode {
    constructor(
        childIDS: string[] = [],
    ) {
        super();
        this.id = "ROOT_NODE";
        this.childIDS = childIDS;
    }
}