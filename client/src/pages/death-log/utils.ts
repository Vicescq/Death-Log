import type { Subject } from "../../model/tree-node-model/SubjectSchema";
import type {
	DistinctTreeNode,
	Tree,
	TreeNode,
} from "../../model/tree-node-model/TreeNodeSchema";
import { createDeath } from "../../stores/utils";
import { assertIsNonNull } from "../../utils/asserts";

export function calcDeaths(node: DistinctTreeNode, tree: Tree) {
	let sum = 0;
	switch (node.type) {
		case "game":
			node.childIDS.forEach((id) => {
				const profile = tree.get(id);
				if (profile) {
					profile.childIDS.forEach((id) => {
						const subject = tree.get(id);
						if (subject && subject.type == "subject") {
							sum += subject.log.length;
						}
					});
				}
			});
			return sum;
		case "profile":
			node.childIDS.forEach((id) => {
				const subject = tree.get(id);
				if (subject && subject.type == "subject") {
					sum += subject.log.length;
				}
			});
			return sum;
		case "subject":
			return node.log.length;
	}
}

export function stressTestDeathObjects(size: number, subject: Subject) {
	return Array.from({ length: size }, () => createDeath(subject, null, true));
}

export function sortChildIDS(parentNode: TreeNode, tree: Tree) {
	const sorted = parentNode.childIDS.toSorted((a, b) => {
		const nodeA = tree.get(a);
		const nodeB = tree.get(b);

		assertIsNonNull(nodeA);
		assertIsNonNull(nodeB);

		let result = 0;

		function applyWeights(node: DistinctTreeNode) {
			// non complete-> completed
			let weight = 0;
			if (node.completed) {
				weight = -100;
			} else {
				weight = 100;
			}
			return weight;
		}

		const nodeAWeights = applyWeights(nodeA);
		const nodeBWeights = applyWeights(nodeB);
		if (nodeAWeights == nodeBWeights) {
			if (nodeA.completed) {
				assertIsNonNull(nodeA.dateEnd);
				assertIsNonNull(nodeB.dateEnd);
				result = Date.parse(nodeB.dateEnd) - Date.parse(nodeA.dateEnd);
			} else {
				result =
					Date.parse(nodeB.dateStart) - Date.parse(nodeA.dateStart);
			}
		} else {
			result = nodeBWeights > nodeAWeights ? 1 : -1;
		}
		return result;
	});
	return sorted;
}
