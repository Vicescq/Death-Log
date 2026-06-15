const PLACEHOLDER_VIEWS = [
	{
		id: "default",
		label: "Default",
		description: "Built-in preset",
		locked: true,
	},
	{
		id: "my-view",
		label: "My View",
		description: "Last saved Jun 12",
		locked: false,
	},
];

const LOADED_VIEW_ID = "my-view";

export default function ViewList() {
	return (
		<div className="space-y-2">
			{PLACEHOLDER_VIEWS.map((view) => {
				const isLoaded = view.id === LOADED_VIEW_ID;
				const isDeletable = !view.locked;
				const canLoad = !isLoaded;
				return (
					<div
						key={view.id}
						className={`border-base-300 flex items-center gap-3 rounded-lg border px-4 py-3 ${isLoaded ? "bg-primary/10 border-primary" : "bg-base-200"}`}
					>
						<div className="flex-1 space-y-0.5">
							<div className="flex items-center gap-2">
								<span className="text-lg font-medium">
									{view.label}
								</span>
								{view.locked && (
									<span className="badge badge-neutral badge-xs">
										default
									</span>
								)}
								{isLoaded && (
									<span className="badge badge-primary badge-xs">
										loaded
									</span>
								)}
							</div>
							<p className="text-base-content text-xs">
								{view.description}
							</p>
						</div>

						{isDeletable && (
							<button className="btn btn-disabled">Delete</button>
						)}
						{canLoad && (
							<button className="btn btn-ghost">Load</button>
						)}
					</div>
				);
			})}
		</div>
	);
}
