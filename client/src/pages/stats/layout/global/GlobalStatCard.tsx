type Props = {
	label: string;
	value: string;
	hint?: string;
	size?: "normal" | "hero";
};

export default function GlobalStatCard({
	label,
	value,
	hint,
	size = "normal",
}: Props) {
	const hero = size === "hero";

	return (
		<div
			className={`border-base-300 bg-base-200 flex min-w-0 flex-col rounded-2xl border p-5 shadow-lg ${
				hero ? "items-center text-center" : ""
			}`}
		>
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium tracking-wide uppercase opacity-70">
					{label}
				</span>
			</div>

			<span
				className={`max-w-full truncate font-bold ${
					hero ? "mt-2 text-6xl" : "mt-1 text-4xl"
				}`}
			>
				{value}
			</span>

			{hint && <span className="mt-1 text-sm opacity-60">{hint}</span>}
		</div>
	);
}
