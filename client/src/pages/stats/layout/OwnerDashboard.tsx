import { useMemo } from "react";
import { useUser } from "@clerk/react";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { StatsPipeline } from "../../../services/stats-query/StatsPipeline";
import { type StatsContextState } from "../hooks/useStatsContext";
import useProfile from "../hooks/useProfile";
import DashboardShell from "./DashboardShell";

export default function OwnerDashboard() {
	const tree = useDeathLogStore((state) => state.tree);
	const tables = useMemo(() => StatsPipeline.Flatten(tree), [tree]);

	const myUsername = useUser().user?.username ?? "";
	const { profile, status } = useProfile(myUsername, Boolean(myUsername));

	const value = useMemo<StatsContextState>(
		() => ({
			isSharedPage: false,
			username: myUsername,
			tables,
			profile,
			status,
		}),
		[myUsername, tables, profile, status],
	);
	return <DashboardShell value={value} />;
}
