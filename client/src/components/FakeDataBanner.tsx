import { Link } from "react-router";

export default function FakeDataBanner() {
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
