import type { Profile } from "../../../../model/tree-node-model/ProfileSchema";

type Props = {
	profile: Profile;
};

export default function DLPGList({ profile }: Props) {
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
			{/* <ul className="list">
				<li className="list-row">abc</li>
				<li className="list-row">abc</li>
				<li className="list-row">abc</li>
			</ul> */}
			<ul className="list">
				{profile.groupings.length > 0
					? profile.groupings.map((group, i) => (
							<li className="list-row">{group.id}</li>
						))
					: null}
			</ul>
		</div>
	);
}
