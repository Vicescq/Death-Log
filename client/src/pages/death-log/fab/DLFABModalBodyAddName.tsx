import type { UseFormReturn } from "react-hook-form";
import { CONSTANTS } from "../../../../shared/constants";
import { validateString } from "../../../stores/utils";
import type { AddForm } from "./DeathLogFAB";

type Props = {
	form: UseFormReturn<AddForm, any, AddForm>;
	siblingNames: string[];
};

export default function DLFABModalBodyAddName({ form, siblingNames }: Props) {
	return (
		<>
			<label className="floating-label">
				<span>Name</span>
				<div className="join w-full">
					<input
						type="search"
						className="input bg-base-200 join-item"
						{...form.register("name", {
							validate: (inputText) =>
								validateString(inputText, siblingNames, null),
							maxLength: {
								value: CONSTANTS.INPUT_MAX,
								message: "Too long!",
							},
						})}
					/>
					<button
						type="submit"
						className="btn join-item btn-success"
						disabled={!form.formState.isValid}
					>
						+
					</button>
				</div>
			</label>

			{form.formState.errors.name && (
				<div className="text-error">
					{form.formState.errors.name.message}
				</div>
			)}
		</>
	);
}
