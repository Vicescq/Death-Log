import type {
	FieldValues,
	UseFormRegister,
	Path,
	FieldError,
} from "react-hook-form";
import { CONSTANTS } from "../../../../shared/constants";
import type { Subject } from "../../../model/tree-node-model/SubjectSchema";
import { assertIsNonNull } from "../../../utils/asserts";
import type { PGFormMember } from "../../../model/formSchemas";

type Props<T extends FieldValues> = {
	register: UseFormRegister<T>;
	registeredNames: RegisteredNames<T>;
	errors: Errors;
	subjects: Subject[];
	members: PGFormMember[];
	onMemberAdd: (id: string) => void;
	onMemberDelete: (index: number) => void;
	searchQuery: string;
	onChangeSearchQuery: (query: string) => void;
	type: "edit" | "add";
};

type RegisteredNames<T extends FieldValues> = {
	title: Path<T>;
	description: Path<T>;
};

type Errors = {
	title: FieldError | undefined;
	description: FieldError | undefined;
};

export default function ProfileGroupBaseModifyLayout<T extends FieldValues>({
	register,
	registeredNames,
	errors,
	subjects,
	members,
	onMemberAdd,
	onMemberDelete,
	searchQuery,
	onChangeSearchQuery,
	type,
}: Props<T>) {
	const addedMembersFormattedForCompare = members.map((member) =>
		idToSubject(member.memberID).name.toLowerCase(),
	);
	const filteredMembers =
		searchQuery == ""
			? []
			: subjects.filter((subject) => {
					const formattedSubjectName = subject.name.toLowerCase();
					return (
						formattedSubjectName.includes(
							searchQuery.toLowerCase(),
						) &&
						!addedMembersFormattedForCompare.includes(
							formattedSubjectName,
						)
					);
				});

	function idToSubject(memberID: string) {
		const foundSubject = subjects.find((subject) => subject.id == memberID);
		assertIsNonNull(foundSubject);
		return foundSubject;
	}

	return (
		<>
			<label className="floating-label">
				<span>Profile Group Name</span>

				<input
					type="search"
					className="input join-item w-full"
					placeholder={
						type == "add"
							? "Add a new profiile group"
							: "Profile Group Name"
					}
					{...register(registeredNames.title)}
				/>
			</label>
			{errors.title && (
				<span className="text-error">{errors.title.message}</span>
			)}

			<label className="floating-label">
				<span>Description</span>
				<textarea
					className="textarea w-full"
					placeholder="Group Description"
					rows={CONSTANTS.NUMS.TEXTAREA_ROW_MAX}
					{...register(registeredNames.description)}
				/>
			</label>
			{errors.description && (
				<span className="text-error">{errors.description.message}</span>
			)}

			<div>
				<span className="text-[1rem]">
					{type == "add"
						? "Adding the folowing members: "
						: "Current members: "}
					{members.length == 0 ? (
						<span className="text-error text-[1rem]">
							Nothing yet!
						</span>
					) : null}
				</span>
				<ul className="list bg-base-300 max-h-96 overflow-auto rounded-2xl">
					{members.map((member, i) => (
						<li className="list-row" key={member.memberID}>
							{idToSubject(member.memberID).name}
							<button
								className="ml-auto cursor-pointer"
								type="button"
								onClick={() => onMemberDelete(i)}
							>
								✕
							</button>
						</li>
					))}
				</ul>
			</div>

			<label className="floating-label">
				<span>Subject Search</span>
				<input
					type="search"
					className="input join-item w-full"
					placeholder="Search for members"
					value={searchQuery}
					onChange={(e) => onChangeSearchQuery(e.currentTarget.value)}
				/>
			</label>
			{filteredMembers.length > 0 ? (
				<ul className="list bg-base-300 max-h-96 overflow-auto rounded-2xl">
					{filteredMembers.map((subject) => (
						<li className="list-row" key={subject.id}>
							{subject.name}{" "}
							<button
								className="ml-auto cursor-pointer"
								type="button"
								onClick={() => onMemberAdd(subject.id)}
							>
								+
							</button>
						</li>
					))}
				</ul>
			) : searchQuery != "" ? (
				<span className="text-error text-center text-[1rem]">
					No results found!
				</span>
			) : null}
		</>
	);
}
