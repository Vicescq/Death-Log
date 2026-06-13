export type NodeQueryScope =
	| { type: "global" }
	| { type: "game"; ids: string[] }
	| { type: "profile"; ids: string[] }
	| { type: "group"; ids: string[] };

export type DeathQueryScope =
	| NodeQueryScope
	| { type: "subject"; ids: string[] };
