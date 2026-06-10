import { expect, test, beforeEach, afterEach } from "vitest";
import { NodeScopingStage, DeathScopingStage } from "./ScopingStage";
import { setupTestTree, cleanupTestTree } from "./fixtures";

let fixture: ReturnType<typeof setupTestTree>;

beforeEach(() => {
	fixture = setupTestTree();
});

afterEach(() => {
	cleanupTestTree();
});

test("NodeScopingStage | scope globally for games", () => {
	const stage = new NodeScopingStage("games");
	const filterStage = stage.scope();
	expect(filterStage).toBeDefined();
	// Further assertions happen in filter stage tests
});

test("NodeScopingStage | scope by game for profiles", () => {
	const stage = new NodeScopingStage("profiles");
	const filterStage = stage.scope({
		type: "game",
		ids: [fixture.gameID],
	});
	expect(filterStage).toBeDefined();
});

test("NodeScopingStage | scope globally for subjects", () => {
	const stage = new NodeScopingStage("subjects");
	const filterStage = stage.scope();
	expect(filterStage).toBeDefined();
});

test("NodeScopingStage | scope by profile for subjects", () => {
	const stage = new NodeScopingStage("subjects");
	const filterStage = stage.scope({
		type: "profile",
		ids: [fixture.profileID],
	});
	expect(filterStage).toBeDefined();
});

test("NodeScopingStage | scope by profile group for subjects", () => {
	const stage = new NodeScopingStage("subjects");
	const filterStage = stage.scope({
		type: "group",
		ids: [`${fixture.profileID}&${fixture.profileGroupID}`],
	});
	expect(filterStage).toBeDefined();
});

test("DeathScopingStage | scope globally", () => {
	const stage = new DeathScopingStage();
	const filterStage = stage.scope();
	expect(filterStage).toBeDefined();
	// Should collect all deaths from all subjects
});

test("DeathScopingStage | scope by game", () => {
	const stage = new DeathScopingStage();
	const filterStage = stage.scope({
		type: "game",
		ids: [fixture.gameID],
	});
	expect(filterStage).toBeDefined();
});

test("DeathScopingStage | scope by profile", () => {
	const stage = new DeathScopingStage();
	const filterStage = stage.scope({
		type: "profile",
		ids: [fixture.profileID],
	});
	expect(filterStage).toBeDefined();
});

test("DeathScopingStage | scope by subject", () => {
	const stage = new DeathScopingStage();
	const filterStage = stage.scope({
		type: "subject",
		ids: [fixture.subjectIDs[0]],
	});
	expect(filterStage).toBeDefined();
});
