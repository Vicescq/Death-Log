import { useLocation } from "react-router";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import type { BreadcrumbMember } from "./DeathLogBreadcrumb";

export default function useBreadcrumbMembers(): BreadcrumbMember[] {
    const location = useLocation();

    const ids = location.pathname.split("/").slice(2); // 2 for ignore log route
    const tree = useDeathLogStore((state) => state.tree);

    if (ids.length >= 1 && tree.size >= 1) {
        const names = ids.map((id) => {
            const node = tree.get(id);
            if (node) {
                return node.name
            }
            else {
                return "__BREADCRUMB_PLACEHOLDER__"
            }
        })
        let currLink = "/log";
        return names.map((name, i) => {
            currLink += `/${ids[i]}`
            return { name: name, link: currLink }
        })
    }
    return []
}