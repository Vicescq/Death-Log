import Container from "../../components/Container";
import NavBar from "../../components/nav-bar/NavBar";
import DLPGModify from "../../components/profile-group-edit/DLPGModify";
import type { Profile } from "../../model/tree-node-model/ProfileSchema";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../utils/asserts";
import DeathLogBreadcrumb from "./breadcrumb/DeathLogBreadcrumb";

type Props = {
	profile: Profile;
};

export default function DeathLogProfileGroupEdit({ profile }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const subjects = profile.childIDS.map((id) => {
		const subject = tree.get(id);
		assertIsNonNull(subject);
		assertIsSubject(subject);
		return subject;
	});
	return (
		<>
			<NavBar endNavContent={<DeathLogBreadcrumb/>}/>
			<Container>
				<form>
					<h1 className="my-6 text-center text-4xl font-bold break-words">
						Editing: {profile.name}
					</h1>
					<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
						<legend className="fieldset-legend">
							Profile Groupings Edit
						</legend>
						<DLPGModify
							profile={profile}
							subjects={subjects}
							type="add"
						/>
						<button
							type="button"
							className="btn btn-success w-full"
						>
							Add
						</button>
					</fieldset>
				</form>
			</Container>
		</>
	);
}
