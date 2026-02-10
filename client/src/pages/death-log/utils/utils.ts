import type {
	DistinctTreeNode,
	SubjectContext,
	Tree,
	TreeNode,
} from "../../../model/TreeNodeModel";
import { assertIsNonNull } from "../../../utils";

export function subjectContextToFormattedStr(context: SubjectContext) {
	const subjectContextMap = {
		boss: "Boss",
		location: "Location",
		other: "Other",
		genericEnemy: "Generic Enemy",
		miniBoss: "Mini Boss",
	};
	return subjectContextMap[context];
}

export function formattedStrTosubjectContext(
	formattedStr: string,
): SubjectContext {
	const properStrMap: Record<string, SubjectContext> = {
		Boss: "boss",
		Location: "location",
		Other: "other",
		"Generic Enemy": "genericEnemy",
		"Mini Boss": "miniBoss",
	};
	return properStrMap[formattedStr];
}

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

// export function stressTestDeathObjects(size: number, id: string) {
// 	return Array.from({ length: size }, () => createDeath(id, null, true));
// }

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

export function determineFABType(
	parent: DistinctTreeNode,
): Exclude<DistinctTreeNode["type"], "ROOT_NODE"> {
	switch (parent.type) {
		case "ROOT_NODE":
			return "game";
		case "game":
			return "profile";
		default:
			return "subject";
	}
}
