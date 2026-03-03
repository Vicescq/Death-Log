import type { Profile } from "../../../model/tree-node-model/ProfileSchema";

type Props = {
	modalType: "completion" | "delete";
	focusedGroupIndex: null | number;
	profile: Profile;
	onProfileGroupComplete: () => void;
	onProfileGroupDelete: () => void;
};

export default function DLPGModalBody({
	modalType,
	focusedGroupIndex,
	profile,
	onProfileGroupComplete,
	onProfileGroupDelete,
}: Props) {
	if (focusedGroupIndex == null) return <></>;

	if (modalType == "completion") {
		return (
			<>
				<div className="my-4">
					<span>
						Do you want to mark this as{" "}
						{profile.groupings[focusedGroupIndex].completed
							? "incomplete"
							: "complete"}
						?
					</span>
				</div>
				<button
					className="btn btn-info w-full"
					onClick={onProfileGroupComplete}
				>
					Confirm
				</button>
			</>
		);
	} else {
		return (
			<>
				<div className="my-4">
					<span>Do you want to delete this group?</span>
				</div>
				<button
					className="btn btn-error w-full"
					onClick={onProfileGroupDelete}
				>
					Delete
				</button>
			</>
		);
	}
}
