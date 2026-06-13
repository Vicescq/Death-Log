import { NodeFilterStage, DeathFilterStage } from "./FilterStage";
import { NodeScopingStage, DeathScopingStage } from "./ScopingStage";

/**
 * Fetch stage for games - no scoping allowed (games are root level)
 */
export class GamesFetchStage {
	scopedGlobally(): NodeFilterStage {
		return new NodeScopingStage("games").scope();
	}
}

/**
 * Fetch stage for profiles - can scope by game or globally
 */
export class ProfilesFetchStage {
	scopedByGame(gameIds: string[]): NodeFilterStage {
		return new NodeScopingStage("profiles").scope({
			type: "game",
			ids: gameIds,
		});
	}

	scopedGlobally(): NodeFilterStage {
		return new NodeScopingStage("profiles").scope();
	}
}

/**
 * Fetch stage for subjects - can scope by game, profile, group, or globally
 */
export class SubjectsFetchStage {
	scopedByGame(gameIds: string[]): NodeFilterStage {
		return new NodeScopingStage("subjects").scope({
			type: "game",
			ids: gameIds,
		});
	}

	scopedByProfile(profileIds: string[]): NodeFilterStage {
		return new NodeScopingStage("subjects").scope({
			type: "profile",
			ids: profileIds,
		});
	}

	scopedByGroup(groupAggregatedWithProfileIds: string[]): NodeFilterStage {
		return new NodeScopingStage("subjects").scope({
			type: "group",
			ids: groupAggregatedWithProfileIds,
		});
	}

	scopedGlobally(): NodeFilterStage {
		return new NodeScopingStage("subjects").scope();
	}
}

/**
 * Fetch stage for deaths - can scope by game, profile, group, subject, or globally
 */
export class DeathsFetchStage {
	scopedByGame(gameIds: string[]): DeathFilterStage {
		return new DeathScopingStage().scope({
			type: "game",
			ids: gameIds,
		});
	}

	scopedByProfile(profileIds: string[]): DeathFilterStage {
		return new DeathScopingStage().scope({
			type: "profile",
			ids: profileIds,
		});
	}

	scopedByGroup(groupAggregatedWithProfileIds: string[]): DeathFilterStage {
		return new DeathScopingStage().scope({
			type: "subject",
			ids: groupAggregatedWithProfileIds,
		});
	}

	scopedBySubject(subjectIds: string[]): DeathFilterStage {
		return new DeathScopingStage().scope({
			type: "subject",
			ids: subjectIds,
		});
	}

	scopedGlobally(): DeathFilterStage {
		return new DeathScopingStage().scope(undefined);
	}
}
