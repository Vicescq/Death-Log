import { useLocation, useParams } from "react-router";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import type { BreadcrumbMember } from "./DeathLogBreadcrumb";
import { assertIsNonNull } from "../../../utils/asserts";

export default function useBreadcrumbMembers(): BreadcrumbMember[] {
	const location = useLocation();
	const params = useParams();
	const ids = Object.values(params);
	const tree = useDeathLogStore((state) => state.tree);
	const names: string[] = [];

	function isEditing() {
		const segments = location.pathname
			.split("/")
			.filter((str) => str != "" && str != "log");

		return segments[segments.length - 1] == "edit";
	}

	for (let i = 0; i < ids.length; i++) {
		const id = ids[i];
		assertIsNonNull(id);
		const node = tree.get(id);
		assertIsNonNull(node);
		names.push(node.name);
	}

	let currLink = "/log";
	const breadcrumbMembers: BreadcrumbMember[] = [];
	for (let i = 0; i < names.length; i++) {
		currLink += `/${ids[i]}`;

		breadcrumbMembers.push({ name: names[i], link: currLink });
	}

	if (isEditing()) {
		const lastMember = breadcrumbMembers[breadcrumbMembers.length - 1];
		lastMember.name = `Editing: ${lastMember.name}`;
		lastMember.link = `${currLink}/edit`;
	}

	return breadcrumbMembers;
}
