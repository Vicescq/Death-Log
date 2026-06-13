import type { ReactNode } from "react";

type Props = {
	title: string;
	children: ReactNode;
	actions?: ReactNode;
};

export default function ChartCard({ title, children, actions }: Props) {
	return (
		<div className="border-base-300 bg-base-200 flex h-full flex-col rounded-2xl border p-4 shadow-lg">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="truncate text-lg font-semibold">{title}</h2>
				{actions}
			</div>
			{children}
		</div>
	);
}
