import { useQuery } from "@tanstack/react-query";
import LocalDB from "../../services/LocalDB";
import { formatBytes } from "../../utils/general";

function barColor(percentage: number): string {
	if (percentage >= 90) return "progress-error";
	if (percentage >= 70) return "progress-warning";
	return "progress-primary";
}

export default function StorageUsage() {
	const { data: estimate, isPending } = useQuery({
		queryKey: ["storageEstimate"],
		queryFn: () => LocalDB.showEstimatedQuota(),
	});

	return (
		<div className="bg-base-200 rounded-box mt-1 flex flex-col gap-2 p-4">
			<span className="text-lg font-semibold">Local data used</span>

			{isPending ? (
				<progress className="progress w-full" />
			) : estimate ? (
				<>
					<progress
						className={`progress ${barColor(estimate.percentage)} w-full`}
						value={estimate.percentage}
						max="100"
					/>
					<div className="flex items-center justify-between opacity-70">
						<span>
							{formatBytes(estimate.usageBytes)} of{" "}
							{formatBytes(estimate.quotaBytes)}
						</span>
						<span>{estimate.percentage.toFixed(2)} %</span>
					</div>
					<p className="mt-4 text-sm">
						Note that the data displayed here may not accurately
						reflect what amount the browser/app stores on your
						device. It is just an estimate because sometimes the
						device will not delete the cached data right away.
					</p>
					<p className="text-sm">
						It is still useful and around the ballpark though.
					</p>
				</>
			) : (
				<p className="opacity-70">
					Storage usage is unavailable in this environment.
				</p>
			)}
		</div>
	);
}
