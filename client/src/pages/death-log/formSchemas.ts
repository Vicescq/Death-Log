import z, { literal } from "zod";
import {
	DateRangeSchema,
	dateTimeSTDToISO,
	validateDateRange,
} from "../../utils/date";
import { createTreeNodeSchema } from "../../model/tree-node-model/TreeNodeSchema";
import {
	createSubjectSchema,
	TimeSpentEditFormSchema,
} from "../../model/tree-node-model/SubjectSchema";
import { CONSTANTS } from "../../../shared/constants";
import { formatString } from "../../utils/general";
import { createProfileGroupSchema } from "../../model/tree-node-model/ProfileSchema";

const createBaseNodeFormSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	const PickedSubjectSchema = createSubjectSchema(
		siblingNames,
		currEditingName,
	).pick({
		reoccurring: true,
		context: true,
	});

	const BaseNodeFormSchema = createTreeNodeSchema(
		siblingNames,
		currEditingName,
	)
		.pick({
			name: true,
			notes: true,
		})
		.extend(DateRangeSchema.shape)
		.extend(PickedSubjectSchema.shape)
		.extend(TimeSpentEditFormSchema.shape);

	return BaseNodeFormSchema;
};

export const createNodeFormEditSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	const BaseNodeFormSchema = createBaseNodeFormSchema(
		siblingNames,
		currEditingName,
	);

	const NodeFormEditSchema =
		BaseNodeFormSchema.superRefine(validateDateRange);

	return NodeFormEditSchema;
};

export const createNodeFormAddSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	const BaseNodeFormSchema = createBaseNodeFormSchema(
		siblingNames,
		currEditingName,
	);
	const NodeFormAddSchema = BaseNodeFormSchema.pick({
		name: true,
		context: true,
		reoccurring: true,
	});
	return NodeFormAddSchema;
};

export type NodeFormEdit = z.infer<ReturnType<typeof createNodeFormEditSchema>>;
export type NodeFormAdd = z.infer<ReturnType<typeof createNodeFormAddSchema>>;
const BaseEditDeathFormSchema = z.object({
	remark: z
		.string()
		.transform((remark) => formatString(remark))
		.pipe(
			z.string().max(CONSTANTS.NUMS.INPUT_MAX_LESSER, {
				error: CONSTANTS.ERROR.MAX_LENGTH,
			}),
		),

	date: z.iso.date({ error: CONSTANTS.ERROR.DATE }),
	time: z.iso.time({ precision: 0, error: CONSTANTS.ERROR.TIME }),
	timestampRel: z.literal(["T", "F"]),
});

export const DeathCounterFormSchema = BaseEditDeathFormSchema.pick({
	remark: true,
	timestampRel: true,
});

export const EditDeathFormSchema = BaseEditDeathFormSchema.superRefine(
	(schema, ctx) => {
		// see edit form schema for try catch explanation
		try {
			const parsedUTCdateTime = Date.parse(
				dateTimeSTDToISO(schema.date, schema.time),
			);

			if (parsedUTCdateTime > Date.now()) {
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
					path: ["date"],
				});
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
					path: ["time"],
				});
			}
		} catch {
			return;
		}
	},
);

export type EditDeathForm = z.infer<typeof EditDeathFormSchema>;
export type DeathCounterForm = z.infer<typeof DeathCounterFormSchema>;

const PGFormMemberSchema = z.object({ memberID: z.string() }); // useFieldArray requires primitives to be wrapped in an obj

export const createPGFormAddSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) =>
	createProfileGroupSchema(siblingNames, currEditingName)
		.pick({
			title: true,
			description: true,
		})
		.extend(z.object({ members: z.array(PGFormMemberSchema) }).shape);

export const createPGFormEditSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) =>
	createProfileGroupSchema(siblingNames, currEditingName)
		.pick({
			title: true,
			description: true,
		})
		.extend(z.object({ members: z.array(PGFormMemberSchema) }).shape)
		.extend(DateRangeSchema.shape)
		.superRefine(validateDateRange);

export type PGFormAdd = z.infer<ReturnType<typeof createPGFormAddSchema>>;
export type PGFormEdit = z.infer<ReturnType<typeof createPGFormEditSchema>>;
export type PGFormMember = z.infer<typeof PGFormMemberSchema>;

export const FilterSchema = z.object({
	uncompleted: z.boolean(),
	completed: z.boolean(),
	reoccurring: z.boolean(),
	azRange: z
		.string()
		.regex(/^[a-z]-[a-z]$/i, { error: CONSTANTS.ERROR.GEN_FORMAT }),
	dateFrom: z.iso.date(),
	dateTo: z.iso.date(),
	deathRange: z
		.string()
		.regex(/^((=|<|<=|>|>=)\d+|\d+-\d+)$/, {
			error: CONSTANTS.ERROR.GEN_FORMAT,
		}),
	reliable: z.boolean(),
	unreliable: z.boolean(),
	notes: z.boolean(),
	noNotes: z.boolean(),
});

export type Filter = z.infer<typeof FilterSchema>