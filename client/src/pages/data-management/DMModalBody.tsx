import type { ref } from "process";
import { db } from "../../model/LocalDBSchema";
import { refreshTree } from "../../stores/utils";
import { useDeathLogStore } from "../../stores/useDeathLogStore";

type Props = {
	type: "delete" | "reset" | "import";
	modalRef: React.RefObject<HTMLDialogElement | null>;
	importRef: React.RefObject<HTMLInputElement | null>;
};

export default function DMModalBody({ type, modalRef, importRef }: Props) {
	const initTree = useDeathLogStore((state) => state.initTree);

	if (type == "import") {
	} else if (type == "delete") {
		return (
			<>
				<button className="btn"></button>
			</>
		);
	} else {
	}
}
