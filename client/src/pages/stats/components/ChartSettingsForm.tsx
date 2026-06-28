import LocalDB from "../../../services/LocalDB";

export default function ChartSettingsForm({
	id,
	hasReliability,
	showUnreliable,
}: {
	id: string;
	hasReliability: boolean;
	showUnreliable: boolean;
}) {
	return (
		<div className="flex flex-col gap-5 py-3">
			{hasReliability && (
				<label className="flex cursor-pointer items-center justify-between gap-3">
					<span className="text-sm">Show unreliable timestamps</span>
					<input
						type="checkbox"
						className="toggle toggle-info"
						defaultChecked={showUnreliable}
						onChange={(e) =>
							LocalDB.setChartOverride(id, {
								showUnreliable: e.currentTarget.checked,
							})
						}
					/>
				</label>
			)}
		</div>
	);
}
