import { useParams, useSearchParams } from "react-router";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import type { BreadcrumbMember } from "./DeathLogBreadcrumb";
import { assertIsNonNull } from "../../../utils/asserts";

export default function useBreadcrumbMembers(): BreadcrumbMember[] {
	const params = useParams();
	const [qParams] = useSearchParams();
	const tree = useDeathLogStore((state) => state.tree);
	const names: string[] = [];
	const isEditing = qParams.get("edit") === "main";
	const isProfileGroupEditing = qParams.get("edit") === "pg";

	const ids: string[] = [];
	function traceNodeLineage(id: string) {
		const node = tree.get(id);
		assertIsNonNull(node);
		if (id == "ROOT_NODE") {
			return;
		}
		ids.push(id);
		traceNodeLineage(node.parentID);
	}
	if (params.id) {
		traceNodeLineage(params.id);
		ids.reverse();
		console.log(ids);
	}

	for (let i = 0; i < ids.length; i++) {
		const id = ids[i];
		assertIsNonNull(id);
		const node = tree.get(id);
		assertIsNonNull(node);
		names.push(node.name);
	}

	const breadcrumbMembers: BreadcrumbMember[] = [
		{ name: "Death Log", link: "/log" },
	];
	for (let i = 0; i < names.length; i++) {
		breadcrumbMembers.push({ name: names[i], link: `/log/${ids[i]}` });
	}

	if (isEditing || isProfileGroupEditing) {
		const lastMember = breadcrumbMembers[breadcrumbMembers.length - 1];
		lastMember.name = `Editing: ${lastMember.name}`;
		if (isEditing) {
			lastMember.qParam = "?edit=main";
		}
		if (isProfileGroupEditing) {
			lastMember.qParam = "?edit=pg";
		}
	}

	return breadcrumbMembers;
}
