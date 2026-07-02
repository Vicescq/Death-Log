import { Link, useLocation } from "react-router";
import { useDeathLogStore } from "../stores/useDeathLogStore";

export default function FakeDataBanner() {
	const location = useLocation();
	const tree = useDeathLogStore((state) => state.tree);

	if (location.pathname.startsWith("/profiles/")) return null;

	const hasFakeData = Array.from(tree.values()).some((node) => node.isFake);
	if (!hasFakeData) return null;

	return (
		<div className="alert alert-info justify-center rounded-none text-center text-sm">
			<span>
				This death log contains generated sample data. To remove, please
				press the UNDO FAKE DATA button in{" "}
				<Link to="/data-management" className="link link-neutral">
					Data Management
				</Link>
				.
			</span>
		</div>
	);
}
