import NavBar from "../../../components/navBar/NavBar";
import type { Profile } from "../../../model/TreeNodeModel";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../../utils";
import DeathLogBreadcrumb from "../DeathLogBreadcrumb";
import DLPGModify from "./DLPGModify";
import DLPGList from "./DLPGList";

type Props = {
	profile: Profile;
};

export default function DeathLogProfileGroup({ profile }: Props) {
	const tree = useDeathLogStore((state) => state.tree);

	const subjects = profile.childIDS.map((id) => {
		const subject = tree.get(id);
		assertIsNonNull(subject);
		assertIsSubject(subject);
		return subject;
	});

	return (
		<>
			<NavBar
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>

			<div className="m-auto mb-8 w-[90%] lg:max-w-[45rem]">
				<h1 className="text-center text-4xl font-bold">
					{profile.name} Profile Groups
				</h1>

				<DLPGList profile={profile} />

				<DLPGModify profile={profile} subjects={subjects} />
			</div>
		</>
	);
}
