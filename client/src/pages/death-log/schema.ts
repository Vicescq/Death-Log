import z from "zod";
import {
	DateRangeSchema,
	dateTimeSTDToISO,
	validateDateRange,
} from "../../utils/date";
import { createTreeNodeSchema } from "../../model/tree-node-model/TreeNodeSchema";
import { createSubjectSchema } from "../../model/tree-node-model/SubjectSchema";
import { ProfileGroupSchema } from "../../model/tree-node-model/ProfileSchema";
import { CONSTANTS } from "../../../shared/constants";
import { formatString } from "../../utils/general";

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
			dateStartRel: true,
			dateEndRel: true,
		})
		.extend(DateRangeSchema.shape)
		.extend(PickedSubjectSchema.shape);

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
			z.string().max(CONSTANTS.NUMS.INPUT_MAX_LESS, {
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

const PGFormAddSchema = ProfileGroupSchema.pick({
	title: true,
	description: true,
	members: true,
})
	.extend(DateRangeSchema.shape)
	.superRefine(validateDateRange);

const PGFormEditSchema = ProfileGroupSchema.pick({
	title: true,
	description: true,
	members: true,
})
	.extend(DateRangeSchema.shape)
	.superRefine(validateDateRange);

type PGFormAdd = z.infer<typeof PGFormAddSchema>;
type PGFormEdit = z.infer<typeof PGFormEditSchema>;
