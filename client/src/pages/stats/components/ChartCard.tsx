import { useState } from "react";
import type { ReactNode } from "react";
import fullscreen from "../../../assets/fullscreen.svg";
import notes from "../../../assets/notes.svg";
import gear from "../../../assets/settings.svg";

type Props = {
	title: string;
	children: ReactNode;
	settings?: ReactNode;
};

export default function ChartCard({ title, children, settings }: Props) {
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<div className="border-base-300 bg-base-200 flex h-full flex-col rounded-2xl border p-4 shadow-lg">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="truncate text-lg font-semibold">{title}</h2>

				<div className="relative">
					<button
						onClick={() => setSettingsOpen((o) => !o)}
						className="btn btn-xs btn-ghost"
						aria-label="Chart settings"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className={`h-4 w-4 transition-transform duration-200 ${settingsOpen ? "rotate-180" : ""}`}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19.5 8.25l-7.5 7.5-7.5-7.5"
							/>
						</svg>
					</button>
					{settingsOpen && (
						<ul className="menu border-base-300 bg-neutral absolute right-0 z-10 mt-1 w-max rounded-lg border p-1 shadow-lg">
							<li>
								<button>
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
							<li>
								<button>
									<img
										src={notes}
										className="h-4 w-4 shrink-0"
										alt=""
									/>
									Notes
								</button>
							</li>

							{settings}
						</ul>
					)}
				</div>
			</div>
			{children}
		</div>
	);
}
