export default function StatsErrorMessage({ message }: { message: string }) {
	return (
		<div className="border-error/40  text-error rounded-lg border p-4 text-center">
			{message}
		</div>
	);
}
