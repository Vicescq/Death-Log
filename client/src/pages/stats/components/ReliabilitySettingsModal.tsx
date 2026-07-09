import type { RefObject } from "react";
import Modal from "../../../components/Modal";
import ChartSettingsForm from "./ChartSettingsForm";
import LocalDB from "../../../services/LocalDB";

type Props = {
	modalRef: RefObject<HTMLDialogElement | null>;
	onClose: () => void;
	overrideVersion: number;
	queryId: string;
	queryTitle: string;
};

export default function ReliabilitySettingsModal({
	modalRef,
	onClose,
	overrideVersion,
	queryId,
	queryTitle,
}: Props) {
	return (
		<Modal
			ref={modalRef}
			header={`${queryTitle} Settings`}
			closeBtnName="Close"
			onClose={onClose}
			content={
				<ChartSettingsForm
					key={overrideVersion}
					id={queryId}
					hasReliability
					showUnreliable={
						LocalDB.getChartOverride(queryId).showUnreliable ??
						false
					}
				/>
			}
		/>
	);
}
