type GenericWarning = {
	msg: string;
	type: "generic";
};

type DeleteWarning = {
	msg: string;
	type: "deleteReconfirm";
	handleReconfirm: (type: "delete") => void;
};

type EditWarning = {
	msg: string;
	type: "editReconfirm";
	handleReconfirm: (type: "goBack") => void;
};

type Props = GenericWarning | DeleteWarning | EditWarning;

export default function AlertModalBody(props: Props) {
	let reconfirmContent: React.JSX.Element | null;
	switch (props.type) {
		case "generic":
			reconfirmContent = null;
			break;
		case "deleteReconfirm":
			reconfirmContent = (
				<button
					className="bg-raisinblack rounded-2xl border-4 border-black p-2 font-bold text-white shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					onClick={() =>  props.handleReconfirm("delete")}
				>
					DELETE
				</button>
			);
			break;
		case "editReconfirm":
			reconfirmContent = (
				<button
					className="bg-raisinblack rounded-2xl border-4 border-black p-2 font-bold text-white shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					onClick={() => props.handleReconfirm("goBack")}
				>
					GO BACK
				</button>
			);
	}

	return (
		<>
			<p className="max-w-lg font-bold break-words">
				Warning: {props.msg}
			</p>
			{reconfirmContent}
		</>
	);
}
