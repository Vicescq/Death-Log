import { z } from "zod";
import { GameShapeSchema } from "./GameSchema";
import { ProfileShapeSchema } from "./ProfileSchema";
import { SubjectShapeSchema } from "./SubjectSchema";
import { RootNodeShapeSchema } from "./RootNodeSchema";

export const DistinctTreeNodeShapeSchema = z.discriminatedUnion("type", [
	GameShapeSchema,
	ProfileShapeSchema,
	SubjectShapeSchema,
	RootNodeShapeSchema,
]);
