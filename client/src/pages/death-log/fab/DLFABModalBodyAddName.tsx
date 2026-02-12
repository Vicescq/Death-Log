import type { UseFormReturn } from "react-hook-form";
import { CONSTANTS } from "../../../../shared/constants";
import type { AddForm } from "./schema";

type Props = {
	form: UseFormReturn<AddForm, any, AddForm>;
};

export default function DLFABModalBodyAddName({ form }: Props) {
	return (
		<>
			<label className="floating-label">
				<span>Name</span>
				<div className="join w-full">
					<input
						type="search"
						className="input bg-base-200 join-item"
						{...form.register("name")}
					/>
					<button
						type="submit"
						className="btn join-item btn-success"
						disabled={!form.formState.isValid}
					>
						{CONSTANTS.DEATH_LOG_FAB.ADD_SUBMIT}
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
