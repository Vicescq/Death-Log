import type { ReactNode } from "react";
import fullscreen from "../../../assets/fullscreen.svg";
import gear from "../../../assets/settings.svg";
import Dropdown from "../../../components/Dropdown";
import ChevronIcon from "../../../components/icons/ChevronIcon";

type Props = {
	title: string;
	children: ReactNode;
	settings?: ReactNode;
	onSettings?: () => void;
};

export default function ChartCard({
	title,
	children,
	settings,
	onSettings,
}: Props) {
	return (
		<div className="border-base-300 bg-base-200 flex h-full flex-col rounded-2xl border p-4 shadow-lg">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="truncate text-lg font-semibold">{title}</h2>
				<Dropdown
					trigger={<ChevronIcon />}
					triggerClassName="btn btn-xs btn-ghost"
					contentClassName="menu border-base-300 bg-neutral z-10 mt-1 w-max rounded-lg border p-1 shadow-lg right-0"
				>
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
			</div>
			{children}
		</div>
	);
}
