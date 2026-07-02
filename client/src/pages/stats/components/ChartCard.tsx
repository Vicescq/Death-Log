import type { ReactNode } from "react";
import fullscreen from "../../../assets/fullscreen.svg";
import gear from "../../../assets/settings.svg";
import Dropdown from "../../../components/Dropdown";
import ChevronIcon from "../../../components/icons/ChevronIcon";
import { Z_INDICES } from "../../../../shared/z-indices";

type Props = {
	title: string;
	children: ReactNode;
	settings?: ReactNode;
	onSettings?: () => void;
	hideMenu?: boolean;
};

export default function ChartCard({
	title,
	children,
	settings,
	onSettings,
	hideMenu,
}: Props) {
	return (
		<div className="border-base-300 bg-base-200 flex h-full flex-col rounded-2xl border p-4 shadow-lg">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="truncate text-lg font-semibold">{title}</h2>
				{!hideMenu && (
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
							<button>
								<img
									src={fullscreen}
									className="h-4 w-4 shrink-0"
									alt=""
								/>
								Fullscreen
							</button>
						</li>
						{settings}
					</Dropdown>
				)}
			</div>
			{children}
		</div>
	);
}
