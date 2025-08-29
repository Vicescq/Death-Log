export default function AlertModalBody({msg}: {msg: string}) {

	return (
		<>
			<p className="max-w-lg font-bold break-words">
				Warning: {msg}
			</p>

		</>
	);
}
