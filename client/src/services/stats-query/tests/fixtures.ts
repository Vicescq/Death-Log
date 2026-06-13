import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import {
	createGame,
	createProfile,
	createSubject,
	createDeath,
	createProfileGroup,
} from "../../../stores/utils";
import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";

export interface TestTreeFixture {
	gameID: string;
	profileID: string;
	subjectIDs: string[];
	profileGroupID: string;
	tree: Tree;
}

export function setupTestTree(): TestTreeFixture {
	useDeathLogStore.setState({ tree: new Map() });
	const store = useDeathLogStore.getState();

	const game = createGame("Test Game", store.tree);
	const profile = createProfile("Test Profile", game.id, store.tree);

	const subject1 = createSubject("Subject 1", profile.id, store.tree);
	const subject2 = createSubject("Subject 2", profile.id, store.tree);
	const subject3 = createSubject("Subject 3", profile.id, store.tree);

	// Add deaths to subject1 (reliable timestamps)
	subject1.log.push(createDeath(subject1, "First death", true));
	subject1.log.push(createDeath(subject1, "Second death", true));

	// Add deaths to subject2 (mix of reliable/unreliable)
	subject2.log.push(createDeath(subject2, "Death with remark", true));
	subject2.log.push(createDeath(subject2, null, false)); // no remark, unreliable
	subject2.log.push(createDeath(subject2, "Another death", false));

	// Add deaths to subject3 (only unreliable)
	subject3.log.push(createDeath(subject3, null, false));

	// Create profile group containing subject1 and subject2
	const groupInfo = {
		title: "Test Group",
		description: "Test group for filtering",
		members: [
			{ memberID: subject1.id, name: subject1.name },
			{ memberID: subject2.id, name: subject2.name },
		],
	};
	const profileGroup = createProfileGroup(profile, groupInfo);
	profile.groupings.push(profileGroup);

	// Set parent-child links — createGame/createProfile only use the tree for ID generation
	game.childIDS = [profile.id];
	profile.childIDS = [subject1.id, subject2.id, subject3.id];

	// initTree builds ROOT_NODE automatically from game nodes — don't pass a stale root object
	store.initTree([game, profile, subject1, subject2, subject3]);

	return {
		gameID: game.id,
		profileID: profile.id,
		subjectIDs: [subject1.id, subject2.id, subject3.id],
		profileGroupID: profileGroup.id,
		tree: useDeathLogStore.getState().tree,
	};
}

export function cleanupTestTree(): void {
	useDeathLogStore.setState({ tree: new Map() });
}
