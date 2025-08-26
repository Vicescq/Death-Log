export default function AlertModalBody({ msg }: { msg: string }) {
	return (
		<>
			<p className="max-w-lg break-words">Error Message: {msg}</p>
		</>
	);
}
