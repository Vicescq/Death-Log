import type { StatsView } from "../../../model/StatsViewSchema";
import LockIcon from "../../../components/icons/LockIcon";

type Props = {
	views: StatsView[];
	loadedViewID: string;
	onLoadView: (view: StatsView) => void;
	onDelete: () => void;
};

export default function ViewList({
	views,
	loadedViewID,
	onLoadView,
	onDelete,
}: Props) {
	return (
		<div className="space-y-2">
			{views.map((view) => {
				const isLoaded = view.id === loadedViewID;
				const canLoad = !isLoaded;
				const isDeletable = view.source !== "default";
				return (
					<div
						key={view.id}
						className={`border-base-300 flex items-center gap-3 rounded-lg border px-4 py-3 ${isLoaded ? "bg-primary text-black" : "bg-base-200"}`}
					>
						<div className="flex-1 flex-wrap space-y-0.5">
							<div className="flex items-center gap-2">
								<span className="text-lg font-bold break-all">
									{view.name}
								</span>
								{view.source === "default" && (
									<span className="badge badge-neutral badge-sm">
										default
									</span>
								)}
							</div>
							<p className="text-xs break-all">
								{view.description}
							</p>
						</div>

						{isDeletable && (
							<button className="btn" onClick={onDelete}>
								Delete
							</button>
						)}
						{canLoad && (
							<button
								className="btn"
								onClick={() => onLoadView(view)}
							>
								Load
							</button>
						)}
						{isLoaded && view.source === "default" && (
							<LockIcon className="text-black" />
						)}
					</div>
				);
			})}
		</div>
	);
}
