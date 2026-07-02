import { useMemo } from "react";
import { useParams } from "react-router";
import { type StatsContextState } from "../hooks/useStatsContext";
import useProfile from "../hooks/useProfile";
import DashboardShell from "./DashboardShell";

export default function VisitorDashboard() {
	const { username = "" } = useParams();
	const { profile, status } = useProfile(username);

	const value = useMemo<StatsContextState>(
		() => ({ isSharedPage: true, username, profile, status }),
		[username, profile, status],
	);
	return <DashboardShell value={value} />;
}
