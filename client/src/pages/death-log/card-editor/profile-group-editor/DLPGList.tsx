import edit from "../../../../assets/edit.svg";
import Modal from "../../../../components/Modal";
import { useRef, useState } from "react";
import { assertIsNonNull } from "../../../../utils/asserts";
import type { Profile } from "../../../../model/tree-node-model/ProfileSchema";

type Props = {
	profile: Profile;
	onEditFocus: (i: number) => void;
	onDelete: (i: number) => void;
};

export default function DLPGList({ profile, onEditFocus, onDelete }: Props) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [focusedToBeDeletedIndex, setFocusedToBeDeletedIndex] = useState<
		number | null
	>(null);
	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
				<legend className="fieldset-legend">Profile Groups</legend>
				{profile.groupings.length == 0 ? (
					<span className="text-center">
						This current profile has no groups!
					</span>
				) : (
					<ul className="list max-h-72 overflow-auto">
						{profile.groupings.map((prfoileGroup, i) => {
							return (
								<li key={i} className={`list-row rounded-2xl`}>
									<label className="label">
										<button
											className={`btn btn-xs btn-ghost hover:bg-neutral hover:border-neutral p-0`}
											onClick={() => onEditFocus(i)}
										>
											<img
												src={edit}
												alt=""
												className="w-4"
											/>
										</button>
										<span className="ml-2">
											{prfoileGroup.title}
										</span>
									</label>

									<button
										className="ml-auto cursor-pointer"
										onClick={() => {
											modalRef.current?.showModal();
											setFocusedToBeDeletedIndex(i);
										}}
									>
										✕
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</fieldset>
			<Modal
				ref={modalRef}
				header={"Delete Profile Group?"}
				content={<></>}
				closeBtnName={"Cancel"}
				modalBtns={[
					{
						text: "Delete",
						css: "btn-error",
						disabled: false,
						fn: () => {
							assertIsNonNull(focusedToBeDeletedIndex);
							onDelete(focusedToBeDeletedIndex);
							modalRef.current?.close();
						},
					},
				]}
			/>
		</>
	);
}
