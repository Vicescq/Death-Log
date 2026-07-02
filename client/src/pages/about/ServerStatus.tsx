import { useQuery } from "@tanstack/react-query";
import { HEALTH_QUERY_KEY, healthQueryFn } from "../../services/healthQuery";
import StatusBadge from "./StatusBadge";

export default function ServerStatus({ isOnline }: { isOnline: boolean }) {
	const { isLoading, isError } = useQuery({
		queryKey: HEALTH_QUERY_KEY,
		enabled: isOnline,
		retry: false,
		queryFn: healthQueryFn,
		refetchInterval: 5000,
	});

	if (!isOnline)
		return <StatusBadge tone="error">You are offline</StatusBadge>;
	if (isLoading) return <StatusBadge tone="neutral">Checking...</StatusBadge>;
	if (isError) return <StatusBadge tone="error">Unavailable</StatusBadge>;
	return <StatusBadge tone="success">Operational</StatusBadge>;
}
