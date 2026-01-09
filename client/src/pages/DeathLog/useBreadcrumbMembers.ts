import { useLocation } from "react-router";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { assertIsNonNull } from "../../utils";
import type { BreadcrumbMember } from "./DeathLogBreadcrumb";

export default function useBreadcrumbMembers(): BreadcrumbMember[] {
    const location = useLocation();

    const ids = location.pathname.split("/").slice(2); // 2 for ignore log route
    const tree = useDeathLogStore((state) => state.tree);

    if (ids.length >= 1 && tree.size >= 1) {
        const names = ids.map((id) => {
            const node = tree.get(id);
            assertIsNonNull(node);
            return node.name
        })
        let currLink = "/log";
        return names.map((name, i) => {
            currLink += `/${ids[i]}`
            return { name: name, link: currLink }
        })
    }
    return []
}