import { useParams } from "react-router";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import type { BreadcrumbMember } from "./DeathLogBreadcrumb";
import { assertIsNonNull } from "../../utils";

export default function useBreadcrumbMembers(): BreadcrumbMember[] {
	const params = useParams();

	const ids = Object.values(params); // why can .values be undefined? observe
	const tree = useDeathLogStore((state) => state.tree);

	const names = ids.map((id) => {
		assertIsNonNull(id);
		const node = tree.get(id);
		assertIsNonNull(node);
		return node.name;
	});
	let currLink = "/log";
	return names.map((name, i) => {
		currLink += `/${ids[i]}`;
		return { name: name, link: currLink };
	});
}
