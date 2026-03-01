import { useFieldArray, useForm } from "react-hook-form";
import Container from "../../../components/Container";
import NavBar from "../../../components/nav-bar/NavBar";
import DLPGList from "../../../components/profile-group/DLPGList";
import DLPGModify from "../../../components/profile-group/DLPGModify";
import type {
	Profile,
	ProfileGroup,
} from "../../../model/tree-node-model/ProfileSchema";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../../utils/asserts";
import DeathLogBreadcrumb from "../breadcrumb/DeathLogBreadcrumb";
import { PGFormAddSchema, type PGFormAdd } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
	profile: Profile;
};

export default function DeathLogProfileGroup({ profile }: Props) {
	const tree = useDeathLogStore((state) => state.tree);

	const form = useForm<PGFormAdd>({
		defaultValues: {
			title: "",
			description: "",
			members: [],
		},
		mode: "onChange",
		resolver: zodResolver(PGFormAddSchema),
	});

	const { append, fields } = useFieldArray({
		name: "members",
		control: form.control,
	});

	const subjects = profile.childIDS.map((id) => {
		const subject = tree.get(id);
		assertIsNonNull(subject);
		assertIsSubject(subject);
		return subject;
	});

	console.log(fields, form.getValues("members"))

	return (
		<>
			<NavBar endNavContent={<DeathLogBreadcrumb />} />
			<Container>
				<form>
					<h1 className="my-6 text-center text-4xl font-bold break-words">
						Editing: {profile.name}
					</h1>
					<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full gap-4 border p-4">
						<legend className="fieldset-legend">
							Profile Groupings Edit
						</legend>
						<DLPGList profile={profile} />

						<div className="divider my-0.5" />

						<DLPGModify
							profile={profile}
							subjects={subjects}
							type="add"
							form={form}
							onMemberAdd={(id) => append({ memberID: id })}
						/>

						<div className="divider my-0.5" />

						<button
							type="button"
							className="btn btn-success mt-4 w-full"
						>
							Add
						</button>
					</fieldset>
				</form>
			</Container>
		</>
	);
}
