import {
	createGame,
	createProfile,
	createSubject,
	createDeath,
	generateAndValidateID,
} from "../../stores/utils";
import type {
	DistinctTreeNode,
	Tree,
} from "../../model/tree-node-model/TreeNodeSchema";
import type { Game } from "../../model/tree-node-model/GameSchema";
import type {
	Profile,
	ProfileGroup,
} from "../../model/tree-node-model/ProfileSchema";
import type { Subject, Death } from "../../model/tree-node-model/SubjectSchema";
import type { SubjectSource } from "./types";
import { eldenRing } from "./sources/elden-ring";
import { hollowKnight } from "./sources/hollow-knight";
import { sekiro } from "./sources/sekiro";
import { terraria } from "./sources/terraria";
import { rimworld } from "./sources/rimworld";
import { skyrim } from "./sources/skyrim";
import { silksong } from "./sources/silksong";
import { darkSouls3 } from "./sources/dark-souls-3";
import { dmc5 } from "./sources/dmc5";
import { minecraft } from "./sources/minecraft";
import { expedition33 } from "./sources/expedition-33";
import { pokemonHeartGold } from "./sources/pokemon-heartgold";
import type { GameSource } from "./types";

const GAME_SOURCES: GameSource[] = [
	eldenRing,
	hollowKnight,
	sekiro,
	terraria,
	rimworld,
	skyrim,
	silksong,
	darkSouls3,
	dmc5,
	minecraft,
	expedition33,
	pokemonHeartGold,
];

const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 24 * 60 * 60_000;

const PROFILES_PER_GAME = { min: 1, max: 2 };
const SUBJECTS_PER_PROFILE = { min: 4, max: 7 };

export default class FakeData {
	constructor() {}

	static generate(): DistinctTreeNode[] {
		const tree: Tree = new Map();
		const nodes: DistinctTreeNode[] = [];

		for (const gameSource of FakeData.sample(
			GAME_SOURCES,
			FakeData.randomInt(4, 9),
		)) {
			const game: Game = {
				...createGame(gameSource.gameName, tree),
				isFake: true,
			};
			tree.set(game.id, game);

			const chosenProfiles = FakeData.sample(
				gameSource.profilePool,
				FakeData.randomInt(
					PROFILES_PER_GAME.min,
					PROFILES_PER_GAME.max,
				),
			);

			for (const profileSource of chosenProfiles) {
				const profile: Profile = {
					...createProfile(profileSource.name, game.id, tree),
					isFake: true,
				};
				tree.set(profile.id, profile);
				game.childIDS.push(profile.id);

				const subjectSources = FakeData.sample(
					gameSource.subjectPool,
					FakeData.randomInt(
						SUBJECTS_PER_PROFILE.min,
						SUBJECTS_PER_PROFILE.max,
					),
				);

				const subjectIDs: string[] = [];
				for (const subjectSource of subjectSources) {
					const subject = FakeData.buildSubject(
						subjectSource,
						profile.id,
						tree,
						gameSource.remarkPool,
					);
					tree.set(subject.id, subject);
					profile.childIDS.push(subject.id);
					subjectIDs.push(subject.id);
					nodes.push(subject);
				}

				profile.groupings = FakeData.buildGroups(
					subjectIDs,
					gameSource.groupTitlePool,
				);

				nodes.push(profile);
			}

			nodes.push(game);
		}

		return nodes;
	}

	static removeFakeNodes(nodes: DistinctTreeNode[]): DistinctTreeNode[] {
		return nodes.filter((node) => !node.isFake);
	}

	static keepFakeNodes(nodes: DistinctTreeNode[]): DistinctTreeNode[] {
		return nodes.map((node) =>
			node.isFake ? { ...node, isFake: false } : node,
		);
	}

	private static buildSubject(
		source: SubjectSource,
		profileID: string,
		tree: Tree,
		remarkPool: string[],
	): Subject {
		const base = createSubject(source.name, profileID, tree);

		const timestamps = FakeData.generateDeathTimestamps(
			FakeData.randomDeathCount(),
		);
		const log: Death[] = [];
		for (const ts of timestamps) {
			const remark =
				Math.random() < 0.175 ? FakeData.pick(remarkPool) : null;
			const timestampRel = Math.random() < 0.9;
			const death: Death = {
				...createDeath(base, remark, timestampRel),
				timestamp: new Date(ts).toISOString(),
			};

			log.push(death); // used for the final log field of subject

			// createDeath's collision check reads base.log fresh each call, so
			// keep it in sync or every call would see an empty exclusion set. Very unlikey for nanoid but regardless
			base.log.push(death);
		}

		const completed = Math.random() < 0.5;
		const firstDeath = timestamps[0];
		const lastDeath = timestamps[timestamps.length - 1];

		const dateStartMs =
			firstDeath !== undefined
				? firstDeath - 1 * MS_PER_DAY
				: FakeData.randomPastTimestamp();
		const dateStart = new Date(dateStartMs).toISOString();

		const completionAnchor =
			lastDeath !== undefined
				? lastDeath
				: dateStartMs +
					FakeData.randomInt(MS_PER_MINUTE, 14 * MS_PER_DAY); // offset of creation date + min->2weeks
		const dateEnd = completed
			? new Date(
					Math.min(
						completionAnchor +
							FakeData.randomInt(
								MS_PER_MINUTE,
								60 * MS_PER_MINUTE, // anchor + min->1hr can surpass .now() which violates the business rules
								// with the worst case of dateStartMs === ~ .now() due to randomPastTimestamp()
								// so clamp it with now()
							),
						Date.now(),
					),
				).toISOString()
			: null;

		return {
			...base,
			isFake: true,
			context: source.context,
			reoccurring: source.reoccurring ?? false,
			log,
			dateStart,
			dateEnd,
			completed,
			timeSpent: FakeData.randomTimeSpent(),
			dateStartRel: Math.random() < 0.9,
			dateEndRel: Math.random() < 0.9,
		};
	}

	private static buildGroups(
		subjectIDs: string[],
		groupTitlePool: string[],
	): ProfileGroup[] {
		if (subjectIDs.length < 3) return []; // skip thin groups

		const groupCount = FakeData.randomInt(0, 2); // change to 3-6
		const groups: ProfileGroup[] = [];
		const usedTitles = new Set<string>();

		for (let i = 0; i < groupCount; i++) {
			const memberCount = Math.max(
				2,
				Math.round(subjectIDs.length * (0.3 + Math.random() * 0.3)), // 0.3 + Math.random() * 0.3 === 30% to 60% of subjects only
			);
			const members = FakeData.sample(subjectIDs, memberCount);

			const title =
				FakeData.pickUnused(groupTitlePool, usedTitles) ??
				`Group ${i + 1}`;
			usedTitles.add(title);

			groups.push(FakeData.buildGroup(title, members, groups));
		}

		return groups;
	}

	private static buildGroup(
		title: string,
		members: string[],
		existingGroups: ProfileGroup[],
	): ProfileGroup {
		const completed = Math.random() < 0.4;
		return {
			id: generateAndValidateID({
				type: "generic",
				ids: existingGroups.map((g) => g.id),
			}),
			title,
			description: "",
			members,
			dateStart: new Date(FakeData.randomPastTimestamp()).toISOString(),
			dateEnd: completed ? new Date().toISOString() : null,
			dateStartRel: true,
			dateEndRel: true,
			completed,
		};
	}

	private static randomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	private static pick<T>(arr: T[]): T {
		return arr[FakeData.randomInt(0, arr.length - 1)];
	}

	private static pickUnused<T>(pool: T[], used: Set<T>): T | undefined {
		const available = pool.filter((item) => !used.has(item));
		return available.length === 0 ? undefined : FakeData.pick(available);
	}

	private static sample<T>(pool: T[], count: number): T[] {
		const shuffled = [...pool].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, Math.min(count, shuffled.length));
	}

	private static randomDeathCount(): number {
		const isHardstuck = Math.random() < 0.15;
		return isHardstuck
			? FakeData.randomInt(25, 125)
			: FakeData.randomInt(0, 24);
	}

	private static randomPastTimestamp(monthsBack = 5): number {
		const now = Date.now();
		const past = now - monthsBack * 30 * MS_PER_DAY;
		return past + Math.random() * (now - past);
	}

	private static generateDeathTimestamps(deathCount: number): number[] {
		const timestamps: number[] = [];
		let remainingDeathCount = deathCount;
		while (remainingDeathCount > 0) {
			const sessionSize = Math.min(
				remainingDeathCount,
				FakeData.randomInt(1, 6),
			); // deaths within a session
			const sessionStart = FakeData.randomPastTimestamp();
			for (let i = 0; i < sessionSize; i++) {
				timestamps.push(
					sessionStart +
						i *
							FakeData.randomInt(
								MS_PER_MINUTE,
								6 * MS_PER_MINUTE,
							),
				);
			}
			remainingDeathCount -= sessionSize;
		}
		return timestamps.sort((a, b) => a - b);
	}

	private static randomTimeSpent(): string | null {
		if (Math.random() < 0.4) return null;
		const hours = FakeData.randomInt(0, 6);
		const minutes = FakeData.randomInt(0, 59);
		const seconds = FakeData.randomInt(1, 59); // avoid landing on the disallowed 00:00:00
		const hh =
			hours === 0 ? "00" : hours < 10 ? `0${hours}` : String(hours); // not needed for the range of [0, 6] however it mimics proper formatting for the timeSpent field
		const mm = String(minutes).padStart(2, "0");
		const ss = String(seconds).padStart(2, "0");
		return `${hh}:${mm}:${ss}`;
	}
}
