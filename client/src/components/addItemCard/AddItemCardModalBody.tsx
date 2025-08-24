import Toggle from "../Toggle";
import type {
	AICModalBodyGameProps,
	AICModalBodyProfileProps,
	AICModalBodySubjectProps,
} from "./types";
import SelectDropdown from "../SelectDropDown";

type Props =
	| AICModalBodyGameProps
	| AICModalBodyProfileProps
	| AICModalBodySubjectProps;

export default function AddItemCardModalBody(props: Props) {
	return (
		<ul className="flex flex-col gap-2">
			{props.pageType == "subject" ? (
				<>
					<li className="flex items-center gap-2">
						<span className="mr-auto">Reoccurring</span>
						<Toggle
							enable={props.state.reoccurring}
							handleToggle={() => props.handleToggle("reoccurring")}
						/>
					</li>
					<li className="flex items-center gap-2">
						<span className="mr-auto">Composite</span>
						<Toggle
							enable={props.state.composite}
							handleToggle={() => props.handleToggle("composite")}
						/>
					</li>
				</>
			) : null}
		</ul>
	);
}
