import Toggle from "../Toggle";

export type AddItemCardModalBodyState = {
	"Date Reliability (Start)": boolean,
	"Date Reliability (End)": boolean,
}

type Props = {
	itemState: AddItemCardModalBodyState
};

export default function AddItemCardModalBody({itemState}: Props) {
	return (
		<ul>
			<li className="flex">
				<span>Date Reliability (Start)</span>
				<Toggle 
					enable={itemState["Date Reliability (Start)"]}
					handleToggle={() => 0}
				/>
			</li>
            <li className="flex">
				<span>Date Reliability (End)</span>
				<Toggle
					enable={itemState["Date Reliability (End)"]}
					handleToggle={() => 0}
				/>
			</li>
		</ul>
	);
}
 