import type { UseFormReturn } from "react-hook-form";
import type { Profile } from "../../../model/tree-node-model/ProfileSchema";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import type { NodeFormEdit } from "../schema";
import DLPGList from "../../../components/profile-group/DLPGList";

type Props = {
	profile: Profile;
	form: UseFormReturn<NodeFormEdit, any, NodeFormEdit>;
	modalRef: React.RefObject<HTMLDialogElement | null>;
};

export default function DLCEProfileGroup({ profile, form, modalRef }: Props) {
	const tree = useDeathLogStore((state) => state.tree);

	return (
		<div className="flex flex-col gap-4">
			<div className="divider my-0.5">↓ Profile Groups ↓</div>
			<button
				type="button"
				className="btn btn-accent"
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
	);
}
