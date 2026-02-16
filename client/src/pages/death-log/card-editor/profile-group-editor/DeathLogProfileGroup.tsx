import { useDeathLogStore } from "../../../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../../../utils/asserts";
import { useRef } from "react";
import DLPGList from "./DLPGList";
import DLPGModify from "./DLPGModify";
import type { Profile } from "../../../../model/tree-node-model/ProfileSchema";
import Modal from "../../../../components/Modal";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import type { NodeFormEdit } from "../../schema";

type Props = {
	profile: Profile;
	form: UseFormReturn<NodeFormEdit, any, NodeFormEdit>;
	modalRef: React.RefObject<HTMLDialogElement | null>;
};

export default function DeathLogProfileGroup({
	profile,
	form,
	modalRef,
}: Props) {
	const tree = useDeathLogStore((state) => state.tree);

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="divider my-0.5">↓ Profile Groups ↓</div>
				<button
					type="button"
					className="btn btn-neutral rounded-xl"
					onClick={(e) => {
						e.preventDefault();
						modalRef.current?.showModal();
					}}
				>
					Add Profile Group
				</button>
				<DLPGList profile={profile} />
				<div className="divider my-0.5"></div>
			</div>
		</>
	);
}
