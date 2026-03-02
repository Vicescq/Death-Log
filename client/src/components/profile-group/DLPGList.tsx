import type { Profile } from "../../model/tree-node-model/ProfileSchema";

type Props = {
	profile: Profile;
};

export default function DLPGList({ profile }: Props) {
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
						</li>
					))}
				</ul>
			) : null}
		</section>
	);
}
