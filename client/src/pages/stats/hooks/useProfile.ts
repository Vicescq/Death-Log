import { useQuery } from "@tanstack/react-query";
import Backend from "../../../services/Backend";
import {
	SharedProfileViewSchema,
	type SharedProfileView,
} from "../../../model/stats-query-model/shared-charts";
import type { VisitorStatus } from "./useStatsContext";

export default function useProfile(username: string, enabled = true) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["profile", username],
		enabled,
		queryFn: async ({ signal }): Promise<SharedProfileView | null> => {
			const res = await Backend.visitProfile(username, signal);
			if (res.status === 404) return null;
			if (!res.ok) throw new Error();
			return SharedProfileViewSchema.parse(await res.json());
		},
	});

	const status: VisitorStatus = isLoading
		? "loading"
		: isError
			? "error"
			: data === null
				? "notfound"
				: "ready";

	return { profile: data ?? null, status };
}
