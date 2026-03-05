import type { Profile } from "../../../model/tree-node-model/ProfileSchema";
import edit from "../../../assets/edit_single.svg";

type Props = {
	profile: Profile;
	onDelete: (i: number) => void;
	onComplete: (i: number) => void;
	onEdit: (i: number) => void;
	focusedGroupIndex: number | null;
};

export default function DLPGList({
	profile,
	onDelete,
	onComplete,
	onEdit,
	focusedGroupIndex,
}: Props) {
	return (
		<div>
			<span className="text-[1rem]">
				Profile Groups:{" "}
				{profile.groupings.length == 0 ? (
					<span className="text-error text-[1rem]">
						This profile has no groups!
					</span>
				) : null}
			</span>

			{profile.groupings.length > 0 ? (
				<ul className="list max-h-96 overflow-auto">
					{profile.groupings.map((group, i) => (
						<li
							className={`list-row ${focusedGroupIndex == i ? "bg-neutral" : ""}`}
							key={group.id}
						>
							<input
								type="checkbox"
								checked={group.completed}
								className="checkbox checkbox-info m-auto"
								onChange={() => onComplete(i)}
							/>
							<span
								className={
									group.completed
										? "text-info line-through"
										: ""
								}
							>
								{group.title}
							</span>
							<div className="my-auto flex gap-2">
								<button
									className="cursor-pointer"
									onClick={() => onEdit(i)}
								>
									<img src={edit} className="w-4" alt="" />
								</button>
								<button
									type="button"
									className="my-auto cursor-pointer"
									onClick={() => onDelete(i)}
								>
									✕
								</button>
							</div>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}
