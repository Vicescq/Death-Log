import z from "zod";
import { ProfileGroupSchema } from "../../../model/tree-node-model/ProfileSchema";
import { CONSTANTS } from "../../../../shared/constants";

const PGEFormSchema = ProfileGroupSchema.pick({
	title: true,
	description: true,
	members: true,
	dateStartRel: true,
	dateEndRel: true,
}).extend({
	dateStart: z.iso.date({ error: CONSTANTS.ERROR.DATE }),
	timeStart: z.iso.time({
		precision: 0,
		error: CONSTANTS.ERROR.TIME,
	}),
	dateEnd: z.iso.date({ error: CONSTANTS.ERROR.DATE }).nullable(),
	timeEnd: z.iso
		.time({ precision: 0, error: CONSTANTS.ERROR.TIME })
		.nullable(),
});

type PGEForm = z.infer<typeof PGEFormSchema>