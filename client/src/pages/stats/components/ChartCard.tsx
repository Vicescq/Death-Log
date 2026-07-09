import { useRef, useState, type ReactNode } from "react";
import fullscreen from "../../../assets/fullscreen.svg";
import gear from "../../../assets/settings.svg";
import notes from "../../../assets/notes.svg";
import Dropdown from "../../../components/Dropdown";
import ChevronIcon from "../../../components/icons/ChevronIcon";
import Modal from "../../../components/Modal";
import { Z_INDICES } from "../../../../shared/z-indices";

type Props = {
	title: string;
	children: ReactNode;
	description?: string;
	settings?: ReactNode;
	onSettings?: () => void;
};

export default function ChartCard({
	title,
	children,
	description,
	settings,
	onSettings,
}: Props) {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const dialogFullscreenRef = useRef<HTMLDialogElement>(null);
	const descriptionModalRef = useRef<HTMLDialogElement>(null);

	function openFullscreen() {
		setIsFullscreen(true);
		dialogFullscreenRef.current?.showModal();
	}

	return (
		<>
			<div className="border-base-300 bg-base-200 flex h-full flex-col rounded-2xl border p-4 shadow-lg">
				<div className="mb-3 flex items-center justify-between">
					<h2 className="truncate text-lg font-semibold">{title}</h2>

					<Dropdown
						trigger={<ChevronIcon />}
						triggerClassName="btn btn-xs btn-ghost"
						contentClassName={`menu border-base-300 bg-neutral mt-1 w-max rounded-lg border p-1 shadow-lg right-0 ${Z_INDICES.CHART_CARD_DROPDOWN}`}
					>
						{onSettings && (
							<li>
								<button onClick={onSettings}>
									<img
										src={gear}
										className="h-4 w-4 shrink-0"
										alt=""
									/>
									Settings
								</button>
							</li>
						)}
						<li>
							<button onClick={openFullscreen}>
								<img
									src={fullscreen}
									className="h-4 w-4 shrink-0"
									alt=""
								/>
								Fullscreen
							</button>
						</li>
						{description && (
							<li>
								<button
									onClick={() =>
										descriptionModalRef.current?.showModal()
									}
								>
									<img
										src={notes}
										className="h-4 w-4 shrink-0"
										alt=""
									/>
									Description
								</button>
							</li>
						)}
						{settings}
					</Dropdown>
				</div>
				{!isFullscreen && children}
			</div>

			{description && (
				<Modal
					ref={descriptionModalRef}
					header={`${title} Description`}
					closeBtnName="Close"
					content={
						<p className="my-4 whitespace-pre-line">
							{description}
						</p>
					}
				/>
			)}

			<dialog
				ref={dialogFullscreenRef}
				className="modal"
				onClose={() => setIsFullscreen(false)}
			>
				<div className="modal-box flex h-[95vh] w-[95vw] max-w-none flex-col p-4">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="truncate text-lg font-semibold">
							{title}
						</h2>
						<button
							type="button"
							className="btn btn-sm btn-circle btn-ghost"
							onClick={() => dialogFullscreenRef.current?.close()}
							aria-label="Exit fullscreen"
						>
							✕
						</button>
					</div>
					<div className="flex-1">{isFullscreen && children}</div>
					{description && (
						<p className="mt-3 text-sm whitespace-pre-line opacity-70">
							{description}
						</p>
					)}
				</div>
			</dialog>
		</>
	);
}
