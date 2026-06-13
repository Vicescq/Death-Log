import type { NodeQuery } from "./node-query";
import type { DeathQuery } from "./death-query";

export type { QueryLimit } from "./limit";

export type Query = NodeQuery | DeathQuery;
