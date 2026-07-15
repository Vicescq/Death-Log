const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

type Props = {
	draggable: boolean;
	zoom: number;
	showLabels: boolean;
	onDraggableChange: (draggable: boolean) => void;
	onZoomChange: (zoom: number) => void;
	onShowLabelsChange: (showLabels: boolean) => void;
	onReset: () => void;
	stacked?: boolean;
};

export default function GraphControls({
	draggable,
	zoom,
	showLabels,
	onDraggableChange,
	onZoomChange,
	onShowLabelsChange,
	onReset,
	stacked = false,
}: Props) {
	return (
		<div
			className={
				stacked
					? "flex flex-col gap-4"
					: "bg-base-200 flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-start sm:justify-between"
			}
		>
			<div
				className={`flex items-center justify-between gap-4 ${
					stacked ? "" : "sm:flex-1"
				}`}
			>
				<div>
					<p className="font-semibold">Draggable Nodes</p>
					<p className="pr-4 text-sm opacity-70">
						Dragging is very sensitive on touchscreens, consider
						turning this off on phones.
					</p>
				</div>
				<input
					type="checkbox"
					className="toggle toggle-info"
					checked={draggable}
					onChange={(e) => onDraggableChange(e.target.checked)}
					aria-label="Toggle draggable graph nodes"
				/>
			</div>

			<div
				className={`flex items-center justify-between gap-4 ${
					stacked ? "" : "sm:flex-1"
				}`}
			>
				<div>
					<p className="font-semibold">Node Labels</p>
					<p className="pr-4 text-sm opacity-70">
						Auto by default: labels hide once the graph gets big.
						Toggling overrides that rule.
					</p>
				</div>
				<input
					type="checkbox"
					className="toggle toggle-info"
					checked={showLabels}
					onChange={(e) => onShowLabelsChange(e.target.checked)}
					aria-label="Toggle graph node labels"
				/>
			</div>

			<div className={stacked ? "" : "sm:flex-1"}>
				<p className="font-semibold">
					Zoom{" "}
					<span className="text-sm font-normal opacity-70">
						({zoom.toFixed(1)}x)
					</span>
				</p>
				<p className="pr-4 text-sm opacity-70">
					Starting zoom: lower is further out. Handy on phones where
					pinch zoom is overly sensitive.
				</p>
				<input
					type="range"
					className="range range-info mt-2 w-full"
					min={MIN_ZOOM}
					max={MAX_ZOOM}
					step={ZOOM_STEP}
					value={zoom}
					onChange={(e) => onZoomChange(Number(e.target.value))}
					aria-label="Graph starting zoom"
				/>
			</div>

			<button
				className={`btn btn-outline btn-sm ${
					stacked ? "w-full" : "sm:self-center"
				}`}
				onClick={onReset}
			>
				RESET
			</button>
		</div>
	);
}
