export default function Spinner({
	className = "flex justify-center py-16",
}: {
	className?: string;
}) {
	return (
		<div className={className}>
			<span className="loading loading-spinner loading-lg text-accent" />
		</div>
	);
}
