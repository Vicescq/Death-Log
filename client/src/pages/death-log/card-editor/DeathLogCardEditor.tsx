import { useNavigate } from "react-router";
import NavBar from "../../../components/navBar/NavBar";
import type {
	DistinctTreeNode,
	SubjectContext,
} from "../../../model/TreeNodeModel";
import DeathLogBreadcrumb from "../breadcrumb/DeathLogBreadcrumb";
import DLCEDate from "./DLCEDate";
import DLCEDel from "./DLCEDel";
import DLCESubject from "./DLCESubject";
import { useForm, type SubmitHandler } from "react-hook-form";
import { formatString, validateString } from "../../../stores/utils";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { subjectContextToFormattedStr } from "../utils/utils";
import { isoToDateSTD, isoToTimeSTD } from "../utils/dateUtils";
import { CONSTANTS } from "../../../../shared/constants";
import { assertIsNonNull } from "../../../utils";

type Props = {
	node: DistinctTreeNode;
};

export type NodeForm = {
	name: string;
	dateStart: string;
	timeStart: string;
	startRel: boolean;
	dateEnd: string | null;
	timeEnd: string | null;
	endRel: boolean | null;
	notes: string;

	// only subjects use these
	reoccurring: boolean | null;
	context: string | null;
};

export default function DeathLogCardEditor({ node }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const parent = tree.get(node.parentID);
	assertIsNonNull(parent);
	const siblingNames = parent.childIDS.map((id) => {
		const sibling = tree.get(id);
		assertIsNonNull(sibling);
		return sibling.name;
	});

	const navigate = useNavigate();
	const form = useForm<NodeForm>({
		defaultValues: {
			name: node.name,
			dateStart: isoToDateSTD(node.dateStart),
			timeStart: isoToTimeSTD(node.dateStart),
			startRel: node.dateStartRel,
			dateEnd:
				node.completed && node.dateEnd
					? isoToDateSTD(node.dateEnd)
					: null,
			timeEnd:
				node.completed && node.dateEnd
					? isoToTimeSTD(node.dateEnd)
					: null,
			endRel: node.completed && node.dateEnd ? node.dateEndRel : null,
			notes: node.notes,
			reoccurring: node.type == "subject" ? node.reoccurring : null,
			context:
				node.type == "subject"
					? subjectContextToFormattedStr(node.context)
					: null,
		},
		mode: "onTouched",
	});

	const onSubmit: SubmitHandler<NodeForm> = (formData) => {
		const name = formatString(formData.name);

		if (node.completed) {
		}

		if (node.type == "profile") {
		}

		if (node.type == "subject") {
		}

		// updateNode({ ...node, name: name });
		console.log(form.formState.dirtyFields);
		console.log(formData);
	};

	return (
		<>
			<NavBar
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>

			<div className="m-auto mb-8 w-[90%] sm:max-w-[75%] lg:max-w-[40rem]">
				<h1 className="my-6 text-center text-4xl font-bold">
					Editing: {node.name}
				</h1>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
						<legend className="fieldset-legend">
							View & Edit Fields
						</legend>

						<div className="flex flex-col gap-6">
							<label className="floating-label">
								<span>Name</span>
								<input
									type="search"
									className="input w-full"
									{...form.register("name", {
										validate: (inputText) =>
											validateString(
												inputText,
												siblingNames,
												node.name,
											),
										maxLength: {
											value: CONSTANTS.INPUT_MAX,
											message: "Too long!",
										},
									})}
								/>
								{form.formState.errors.name && (
									<div className="text-error">
										{form.formState.errors.name.message}
									</div>
								)}
							</label>

							<DLCEDate node={node} form={form} />

							{node.type == "subject" ? (
								<DLCESubject node={node} form={form} />
							) : null}

							<label className="floating-label">
								<span>Notes</span>
								<textarea
									className="textarea w-full"
									{...form.register("notes")}
								/>
							</label>

							<DLCEDel node={node} />
						</div>

						<button
							type="submit"
							className="btn btn-success mt-4 w-full"
							disabled={!form.formState.isValid}
						>
							Save Changes
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								navigate(-1);
							}}
							className="btn btn-error w-full"
						>
							Cancel
						</button>
					</fieldset>
				</form>
			</div>
		</>
	);
}
