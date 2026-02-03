export type Tree = Map<string, DistinctTreeNode>;

export type TreeNode = {
	type: "game" | "profile" | "subject" | "ROOT_NODE";
	id: string;
	parentID: string;
	childIDS: string[];
	name: string;
	completed: boolean;
	notes: string;
	dateStart: string;
	dateEnd: string | null;
	dateStartRel: boolean;
	dateEndRel: boolean;
};

export type RootNode = TreeNode & {
	type: "ROOT_NODE";
};

export type DistinctTreeNode = Game | Profile | Subject | RootNode; // for discriminant unions

export type Game = TreeNode & {
	type: "game";
};

export type Profile = TreeNode & {
	type: "profile";
	groupings: ProfileGroup[];
};

export type ProfileGroup = {
	title: string;
	members: string[];
	description: string;
};

export type Subject = TreeNode & {
	type: "subject";
	log: Death[];
	reoccurring: boolean;
	context: SubjectContext;
	timeSpent: string | null;
};

export type Death = {
	id: string;
	parentID: string;
	timestamp: string;
	timestampRel: boolean;
	remark: string | null;
};

export type SubjectContext =
	| "boss"
	| "location"
	| "other"
	| "genericEnemy"
	| "miniBoss";