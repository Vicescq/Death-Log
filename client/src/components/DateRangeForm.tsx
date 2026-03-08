import type {
	FieldError,
	FieldValues,
	Path,
	RegisterOptions,
	UseFormRegister,
} from "react-hook-form";
import type { DistinctTreeNode } from "../model/tree-node-model/TreeNodeSchema";
import { CONSTANTS } from "../../shared/constants";
import type { ProfileGroup } from "../model/tree-node-model/ProfileSchema";

type Props<T extends FieldValues> = {
	contextObj: DistinctTreeNode | ProfileGroup;
	register: UseFormRegister<T>;
	registeredNames: RegisteredNames<T>;
	registeredOptions: DateRegisteredOptions<T>;
	errors: Errors;
	dirtyFields: DirtyFields;
	timeStartUpdateNotice: string | null;
	timeEndUpdateNotice: string | null;
};

type DateRegisteredOptions<T extends FieldValues> = {
	dateStart: RegisterOptions<T, Path<T>> | undefined;
	timeStart: RegisterOptions<T, Path<T>> | undefined;
	dateEnd: RegisterOptions<T, Path<T>> | undefined;
	timeEnd: RegisterOptions<T, Path<T>> | undefined;
};

type RegisteredNames<T extends FieldValues> = {
	dateStart: Path<T>;
	timeStart: Path<T>;
	dateEnd: Path<T>;
	timeEnd: Path<T>;
	dateStartRel: Path<T>;
	dateEndRel: Path<T>;
};

type Errors = {
	dateStart: FieldError | undefined;
	timeStart: FieldError | undefined;
	dateEnd: FieldError | undefined;
	timeEnd: FieldError | undefined;
};

type DirtyFields = {
	dateStart: boolean | undefined;
	timeStart: boolean | undefined;
	dateEnd: boolean | undefined;
	timeEnd: boolean | undefined;
	dateStartRel: boolean | undefined;
	dateEndRel: boolean | undefined;
};

export default function DateRangeForm<T extends FieldValues>({
	contextObj,
	register,
	registeredNames,
	registeredOptions,
	errors,
	dirtyFields,
	timeStartUpdateNotice,
	timeEndUpdateNotice,
}: Props<T>) {
	return (
		<>
			<label className="floating-label">
				<span>Date Created</span>
				<input
					type="date"
					className={`input ${dirtyFields.dateStart ? "input-primary" : ""} join-item w-full`}
					{...register(
						registeredNames.dateStart,
						registeredOptions.dateStart,
					)}
					disabled={dirtyFields.dateEnd || dirtyFields.timeEnd}
				/>
				{errors.dateStart && (
					<div className="text-error">{errors.dateStart.message}</div>
				)}
			</label>

			<label className="floating-label">
				<span>Time Created</span>
				<input
					type="time"
					className={`input ${dirtyFields.timeStart ? "input-primary" : ""} join-item w-full`}
					{...register(
						registeredNames.timeStart,
						registeredOptions.timeStart,
					)}
					step={1}
					disabled={dirtyFields.dateEnd || dirtyFields.timeEnd}
				/>
				{errors.timeStart && (
					<div className="text-error">{errors.timeStart.message}</div>
				)}
				{timeStartUpdateNotice && (
					<div className="text-info">{timeStartUpdateNotice}</div>
				)}
			</label>

			{contextObj.completed && contextObj.dateEnd ? (
				<>
					<label className="floating-label">
						<span>Date Completed</span>
						<input
							type="date"
							className={`input ${dirtyFields.dateEnd ? "input-primary" : ""} join-item w-full`}
							{...register(
								registeredNames.dateEnd,
								registeredOptions.dateEnd,
							)}
							disabled={
								dirtyFields.dateStart || dirtyFields.timeStart
							}
						/>
						{errors.dateEnd && (
							<div className="text-error">
								{errors.dateEnd.message}
							</div>
						)}
					</label>
					<label className="floating-label">
						<span>Time Completed</span>
						<input
							type="time"
							className={`input ${dirtyFields.timeEnd ? "input-primary" : ""} join-item w-full`}
							{...register(
								registeredNames.timeEnd,
								registeredOptions.timeEnd,
							)}
							step={1}
							disabled={
								dirtyFields.dateStart || dirtyFields.timeStart
							}
						/>
						{errors.timeEnd && (
							<div className="text-error">
								{errors.timeEnd.message}
							</div>
						)}
						{timeEndUpdateNotice && (
							<div className="text-info">
								{timeEndUpdateNotice}
							</div>
						)}
					</label>
				</>
			) : null}

			<div>
				<div className="divider my-1">
					<div
						className="tooltip tooltip-info"
						data-tip={CONSTANTS.INFO.RELIABILITY}
					>
						↓ Reliability Flags ↓
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<div className="flex">
						<label
							htmlFor="creation-date-reliable-toggle"
							className={`text-[1rem] ${dirtyFields.dateStartRel ? "text-success" : ""}`}
						>
							Creation Timestamp
						</label>
						<input
							id="creation-date-reliable-toggle"
							type="checkbox"
							className="toggle toggle-primary my-auto ml-auto"
							{...register(registeredNames.dateStartRel)}
						/>
					</div>

					{contextObj.completed ? (
						<div className="flex">
							<label
								htmlFor="completion-date-reliable-toggle"
								className={`text-[1rem] ${dirtyFields.dateEndRel ? "text-success" : ""}`}
							>
								Completion Timestamp
							</label>
							<input
								id="completion-date-reliable-toggle"
								type="checkbox"
								className="toggle toggle-primary my-auto ml-auto"
								{...register(registeredNames.dateEndRel)}
							/>
						</div>
					) : null}
				</div>
				<div className="divider my-1"></div>
			</div>
		</>
	);
}
