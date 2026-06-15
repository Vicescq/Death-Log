import { z } from "zod";

const GlobalScopeSchema = z.object({ type: z.literal("global") });
const GameScopeSchema = z.object({ type: z.literal("game"), ids: z.array(z.string()) });
const ProfileScopeSchema = z.object({ type: z.literal("profile"), ids: z.array(z.string()) });
const GroupScopeSchema = z.object({ type: z.literal("group"), ids: z.array(z.string()) });
const SubjectScopeSchema = z.object({ type: z.literal("subject"), ids: z.array(z.string()) });

export const NodeQueryScopeSchema = z.union([
    GlobalScopeSchema,
    GameScopeSchema,
    ProfileScopeSchema,
    GroupScopeSchema,
]);

export const DeathQueryScopeSchema = z.union([
    GlobalScopeSchema,
    GameScopeSchema,
    ProfileScopeSchema,
    GroupScopeSchema,
    SubjectScopeSchema,
]);

export type NodeQueryScope = z.infer<typeof NodeQueryScopeSchema>;
export type DeathQueryScope = z.infer<typeof DeathQueryScopeSchema>;
