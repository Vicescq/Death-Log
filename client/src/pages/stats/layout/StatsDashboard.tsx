import OwnerDashboard from "./OwnerDashboard";
import VisitorDashboard from "./VisitorDashboard";

export default function StatsDashboard({
	isSharedPage,
}: {
	isSharedPage?: boolean;
}) {
	return isSharedPage ? <VisitorDashboard /> : <OwnerDashboard />;
}
