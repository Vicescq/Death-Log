const STATUS_TONE_CSS = {
	success: "badge-success",
	warning: "badge-warning",
	error: "badge-error",
	neutral: "badge-neutral",
} as const;

type Props = {
	tone: keyof typeof STATUS_TONE_CSS;
	children: string;
};

export default function StatusBadge({ tone, children }: Props) {
	return <span className={`badge ${STATUS_TONE_CSS[tone]}`}>{children}</span>;
}
