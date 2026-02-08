import { useParams, useSearchParams } from "react-router";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import type { BreadcrumbMember } from "./DeathLogBreadcrumb";
import { assertIsNonNull } from "../../../utils";

export default function useBreadcrumbMembers(): BreadcrumbMember[] {
	const params = useParams();
	const [searchParams] = useSearchParams();
	const ids = Object.values(params);
	const tree = useDeathLogStore((state) => state.tree);
	const names: string[] = [];

	function isEditing(i: number) {
		return i == ids.length - 1 && searchParams.get("edit") == "true";
	}

	for (let i = 0; i < ids.length; i++) {
		const id = ids[i];
		assertIsNonNull(id);
		const node = tree.get(id);
		assertIsNonNull(node);
		if (isEditing(i)) {
			names.push(`Editing: ${node.name}`);
		} else {
			names.push(node.name);
		}
	}

	let currLink = "/log";
	let editSearchParams = "?edit=true";
	const breadcrumbMembers: BreadcrumbMember[] = [];
	for (let i = 0; i < names.length; i++) {
		currLink += `/${ids[i]}`;
		if (isEditing(i)) {
			breadcrumbMembers.push({
				name: names[i],
				link: currLink,
				searchParams: editSearchParams,
			});
		} else {
			breadcrumbMembers.push({ name: names[i], link: currLink });
		}
	}

	return breadcrumbMembers;
}
