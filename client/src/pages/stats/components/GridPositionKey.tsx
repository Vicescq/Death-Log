import { useState } from "react";

export default function GridPositionKey() {
	const [open, setOpen] = useState(false);
	return (
		<div className="border-base-300 bg-base-200 rounded-lg border">
			<button
				onClick={() => setOpen((v) => !v)}
				className="flex w-full items-center justify-between px-4 py-3"
			>
				<span className="text-base-content/60 text-xs font-medium tracking-wide uppercase">
					How does ordering work?
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className={`text-base-content/40 transition-transform ${open ? "rotate-180" : ""}`}
				>
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</button>

			{open && (
				<div className="border-base-300 border-t px-4 pt-3 pb-4">
					<div className="flex flex-wrap gap-6">
						<div className="space-y-1">
							<p className="text-base-content/50 mb-1.5 text-xs">
								Desktop (2 columns)
							</p>
							<div className="grid w-36 grid-cols-2 gap-1">
								{[1, 2, 3, 4, 5].map((n) => (
									<div
										key={n}
										className="border-base-300 bg-base-100 flex h-8 items-center justify-center rounded border text-xs"
									>
										{n}
									</div>
								))}
							</div>
						</div>
						<div className="space-y-1">
							<p className="text-base-content/50 mb-1.5 text-xs">
								Mobile (1 column)
							</p>
							<div className="grid w-16 grid-cols-1 gap-1">
								{[1, 2, 3, 4, 5].map((n) => (
									<div
										key={n}
										className="border-base-300 bg-base-100 flex h-8 items-center justify-center rounded border text-xs"
									>
										{n}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
