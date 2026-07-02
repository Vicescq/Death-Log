import type { SubjectContext } from "../../model/tree-node-model/SubjectSchema";

export type SubjectSource = {
	name: string;
	context: SubjectContext;
	reoccurring?: boolean;
};

export type ProfileSource = {
	name: string;
};

export type GameSource = {
	gameName: string;
	remarkPool: string[];
	groupTitlePool: string[];
	profilePool: ProfileSource[];
	subjectPool: SubjectSource[];
};
