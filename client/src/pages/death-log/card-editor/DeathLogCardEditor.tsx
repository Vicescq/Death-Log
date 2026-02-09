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
import { formatString } from "../../../stores/utils";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import {
	isoToDateSTD,
	isoToTimeSTD,
	subjectContextToFormattedStr,
} from "../utils";

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
	});

	const updateNode = useDeathLogStore((state) => state.updateNode);

	const onSubmit: SubmitHandler<NodeForm> = (formData) => {
		const name = formatString(formData.name);

		if (node.completed) {
		}

		if (node.type == "profile") {
		}

		if (node.type == "subject") {
		}

		// updateNode({ ...node, name: name });
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
									{...form.register("name")}
									type="search"
									className="input w-full"
								/>
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
							// disabled
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
