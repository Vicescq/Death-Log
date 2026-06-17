import { useState } from "react";

const PLACEHOLDER_VIEWS = [
	{
		id: "default",
		label: "Default",
		description: "Built-in preset",
		locked: true,
	},
	{
		id: "my-view",
		label: "My Views",
		description: "Last saved Jun 12",
		locked: false,
	},
];

export default function ViewList() {
	const [loadedView, setLoadedView] = useState("default");

	return (
		<div className="space-y-2">
			{PLACEHOLDER_VIEWS.map((view) => {
				const isLoadedT = view.id === loadedView;
				const isDeletable = !view.locked;
				const canLoad = !isLoadedT;
				return (
					<div
						key={view.id}
						className={`border-base-300 flex items-center gap-3 rounded-lg border px-4 py-3 ${isLoadedT ? "bg-primary text-black" : "bg-base-200"}`}
					>
						<div className="flex-1 flex-wrap space-y-0.5">
							<div className="flex items-center gap-2">
								<span className="text-lg font-bold break-all">
									{view.label}
								</span>
								{view.locked && (
									<span className="badge badge-neutral badge-sm">
										default
									</span>
								)}
								{isLoadedT && (
									<span className="badge badge-sm">
										loaded
									</span>
								)}
							</div>
							<p className="text-xs break-all">
								{view.description}
							</p>
						</div>

						{isDeletable && <button className="btn">Delete</button>}
						{canLoad && (
							<button
								className="btn"
								onClick={() => setLoadedView(view.id)}
							>
								Load
							</button>
						)}
					</div>
				);
			})}
		</div>
	);
}
