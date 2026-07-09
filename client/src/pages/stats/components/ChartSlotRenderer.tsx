import { useMemo } from "react";
import { StatsPipeline } from "../../../services/stats-query/StatsPipeline";
import ChartCanvas from "./ChartCanvas";
import ReliabilitySettingsModal from "./ReliabilitySettingsModal";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { useReliabilityOverride } from "../hooks/useReliabilityOverride";
import type { Query } from "../../../model/stats-query-model/query";

export default function ChartSlotRenderer({ query }: { query: Query }) {
	const tree = useDeathLogStore((state) => state.tree);
	const { modalRef, overrideVersion, openSettings, onModalClose } =
		useReliabilityOverride();

	const hasReliability = query.reliability.isTemporal;

	const data = useMemo(
		() => StatsPipeline.Collect(query, tree),
		[query, tree, overrideVersion],
	);

	const option = useMemo(
		() => StatsPipeline.Chart(query, data),
		[query, data],
	);

	return (
		<>
			<ChartCanvas
				title={query.title}
				description={query.description}
				option={option}
				onSettings={hasReliability ? openSettings : undefined}
			/>

			{hasReliability && (
				<ReliabilitySettingsModal
					modalRef={modalRef}
					onClose={onModalClose}
					overrideVersion={overrideVersion}
					queryId={query.id}
					queryTitle={query.title}
				/>
			)}
		</>
	);
}
