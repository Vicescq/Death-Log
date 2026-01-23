import { useParams } from "react-router";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import type { BreadcrumbMember } from "./DeathLogBreadcrumb";
import { assertIsNonNull } from "../../utils";

export default function useBreadcrumbMembers(): BreadcrumbMember[] {
	const params = useParams();
	const ids = Object.values(params); // why can .values be undefined? observe
	const tree = useDeathLogStore((state) => state.tree);

	const names: string[] = [];
	let markedIndex = null;
	for (let i = 0; i < ids.length; i++) {
		const id = ids[i];
		if (id == "profile-group-edit") {
			names.push(`${names[i - 1]}: Profile Group Edit`);
			markedIndex = i;
		} else {
			assertIsNonNull(id);
			const node = tree.get(id);
			assertIsNonNull(node);
			names.push(node.name);
		}
	}

	let currLink = "/log";
	const breadcrumbMembers: BreadcrumbMember[] = [];
	for (let i = 0; i < names.length; i++) {
		if (markedIndex && i == markedIndex - 1) {
			currLink += `/${ids[i]}/${ids[i + 1]}`;
			continue;
		}
		if (i == markedIndex) {
			breadcrumbMembers.push({ name: names[i], link: "" });
		} else {
			currLink += `/${ids[i]}`;
			breadcrumbMembers.push({ name: names[i], link: currLink });
		}
	}

	return breadcrumbMembers;
}
