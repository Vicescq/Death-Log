import { useRef, useState } from "react";
import { ChartSlotSchema } from "../../../model/stats-query-model/chart-slot";
import { BASE_DEFAULT_VIEW } from "../../../services/stats-query/preset-views";
import GridPositionKey from "../manage/GridPositionKey";
import ViewList from "../manage/ViewList";
import ViewListChart from "../manage/ViewListChart";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import useStatsViews from "../hooks/useStatsViews";
import type { StatsView } from "../../../model/StatsViewSchema";
import Modal from "../../../components/Modal";
import FeedbackToast from "../../../components/FeedbackToast";
import CreateViewCard from "../manage/CreateViewCard";

export default function StatsManage() {
	ChartSlotSchema.parse(BASE_DEFAULT_VIEW.charts[0]); // for dev errors
	const [statsViews, setStatsViews] = useStatsViews();

	const views: StatsView[] = [
		...statsViews.defaultViews,
		...statsViews.customViews,
	];

	const [loadedStatsView, setLoadedStatsView] = useState<StatsView>(
		statsViews.defaultViews[0],
	);
	const [chartSlotsTemp, setChartSlotsTemp] = useState(
		loadedStatsView.charts,
	);

	const isDefaultView = statsViews.defaultViews.some(
		({ id }) => id === loadedStatsView.id,
	);

	const dirtyChartSlots: boolean[] = chartSlotsTemp.map(
		(slot, i) => slot.id !== loadedStatsView.charts[i].id,
	);

	const isDirty = chartSlotsTemp.some(
		(slot, i) =>
			slot.id !== loadedStatsView.charts[i]?.id ||
			slot.displayed !== loadedStatsView.charts[i]?.displayed,
	);

	function handleChartSlotToggle(id: string, newDisplayedVal: boolean) {
		setChartSlotsTemp((prev) =>
			prev.map((slot) =>
				id === slot.id ? { ...slot, displayed: newDisplayedVal } : slot,
			),
		);
	}

	const modalRef = useRef<HTMLDialogElement>(null);
	const [alertMode, setAlertMode] = useState<"save" | "reset" | null>(null);
	const [toBeDeleted, setToBeDeleted] = useState<StatsView | null>(null);

	function handleSave() {
		const modifiedLoadedStatsView = { ...loadedStatsView };
		modifiedLoadedStatsView.charts = [...chartSlotsTemp];
		if (modifiedLoadedStatsView.source === "default") {
			setStatsViews((prev) => ({
				...prev,
				defaultViews: prev.defaultViews.map((view) =>
					view.id === modifiedLoadedStatsView.id
						? modifiedLoadedStatsView
						: view,
				),
			}));
		} else {
			setStatsViews((prev) => ({
				...prev,
				customViews: prev.customViews.map((view) =>
					view.id === modifiedLoadedStatsView.id
						? modifiedLoadedStatsView
						: view,
				),
			}));
		}
		setLoadedStatsView(modifiedLoadedStatsView);
		setAlertMode("save");
	}

	function handleReset() {
		if (loadedStatsView.source === "custom") {
			setChartSlotsTemp(loadedStatsView.charts);
		} else {
			setChartSlotsTemp((prev) =>
				prev.map((slot) => ({
					...slot,
					displayed: true,
				})),
			);
		}
		if (isDirty) setAlertMode("reset");
	}

	function handleDelete() {
		if (toBeDeleted?.source === "custom") {
			setStatsViews((prev) => ({
				...prev,
				customViews: prev.customViews.filter(
					(view) => view.id !== toBeDeleted.id,
				),
			}));
		} else {
			throw new Error("DEV Error! Impossible case!");
		}

		const fallback = statsViews.defaultViews[0];
		setLoadedStatsView(fallback);
		setChartSlotsTemp(fallback.charts);
		modalRef.current?.close();
	}

	return (
		<>
			<div className="space-y-6">
				<div className="space-y-1">
					<h2 className="text-base font-semibold">Manage Overview</h2>
					<p className="text-sm opacity-60">
						Choose which charts appear on the Overview tab and drag
						to reorder them.
					</p>
				</div>

				<ViewList
					loadedViewID={loadedStatsView.id}
					views={views}
					onLoadView={(view) => {
						setLoadedStatsView(view);
						setChartSlotsTemp(view.charts);
					}}
					onDelete={(view) => {
						setToBeDeleted(view);
						modalRef.current?.showModal();
					}}
				/>

				<CreateViewCard />

				<GridPositionKey />

				<div className="border-base-300 bg-base-200 divide-base-300 divide-y rounded-lg border">
					<DragDropProvider
						onDragEnd={(e) => {
							setChartSlotsTemp((chartSlots) =>
								move(chartSlots, e),
							);
						}}
					>
						{chartSlotsTemp.map((slot, i) => (
							<ViewListChart
								key={slot.id}
								index={i}
								slot={slot}
								isDefault={isDefaultView}
								isDirty={dirtyChartSlots[i]}
								onDisplayChange={(newDisplayedVal) =>
									handleChartSlotToggle(
										slot.id,
										newDisplayedVal,
									)
								}
							/>
						))}
					</DragDropProvider>
				</div>

				<div className="flex justify-end gap-2">
					<button
						className="btn btn-error"
						onClick={handleReset}
						disabled={!isDirty && !isDefaultView}
					>
						Reset
					</button>
					<button
						className="btn btn-primary"
						onClick={handleSave}
						disabled={!isDirty}
					>
						Save
					</button>
				</div>
			</div>
			<Modal
				closeBtnName="Close"
				content={
					<>
						<div className="mb-4" />
						<button
							className="btn btn-error w-full"
							onClick={handleDelete}
						>
							Delete
						</button>
					</>
				}
				header={"Confirm deletion"}
				ref={modalRef}
				onClose={() => setToBeDeleted(null)}
			/>
			<FeedbackToast
				bgCSS={alertMode && alertMode === "save" ? "success" : "error"}
				displayed={alertMode !== null}
				msg={
					alertMode && alertMode === "save"
						? "View successfully saved!"
						: "Changes have been reset!"
				}
				onClose={() => setAlertMode(null)}
			/>
		</>
	);
}
