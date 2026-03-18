import type {
	DistinctTreeNode,
	Tree,
} from "../../../model/tree-node-model/TreeNodeSchema";
import { sortChildIDS } from "../utils";

export default function useFilterAndSortDL(
	parent: DistinctTreeNode,
	tree: Tree,
) {
	const sortedChildIDs = sortChildIDS(parent, tree);
}
