import type { Profile } from "../../../model/tree-node-model/ProfileSchema";

type Props = {
	profile: Profile;
	onDelete: (i: number) => void;
};

export default function DLPGList({ profile, onDelete }: Props) {
	return (
		<section>
			<span className="text-[1rem]">
				Profile Groups:{" "}
				{profile.groupings.length == 0 ? (
					<span className="text-error text-[1rem]">
						This profile has no groups!
					</span>
				) : null}
			</span>

			{profile.groupings.length > 0 ? (
				<ul className="list">
					{profile.groupings.map((group, i) => (
						<li className="list-row" key={group.id}>
							{group.title}
							<button
								type="button"
								className="ml-auto cursor-pointer"
								onClick={() => onDelete(i)}
							>
								✕
							</button>
						</li>
					))}
				</ul>
			) : null}
		</section>
	);
}
