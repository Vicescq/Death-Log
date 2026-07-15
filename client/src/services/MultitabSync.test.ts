import { expect, test, vi } from "vitest";

class FakeBroadcastChannel {
	static instances: FakeBroadcastChannel[] = [];
	name: string;
	posted: unknown[] = [];
	private listeners: ((event: MessageEvent) => void)[] = [];

	constructor(name: string) {
		this.name = name;
		FakeBroadcastChannel.instances.push(this);
	}

	postMessage(data: unknown) {
		this.posted.push(data);
	}

	addEventListener(_type: string, listener: (event: MessageEvent) => void) {
		this.listeners.push(listener);
	}

	removeEventListener(
		_type: string,
		listener: (event: MessageEvent) => void,
	) {
		this.listeners = this.listeners.filter((l) => l !== listener);
	}

	emit(data: unknown) {
		this.listeners.forEach((listener) =>
			listener({ data } as MessageEvent),
		);
	}
}

async function freshMultitabSync() {
	vi.resetModules();
	const { MultitabSync } = await import("./MultitabSync");
	return MultitabSync;
}

test.beforeEach(() => {
	FakeBroadcastChannel.instances = [];
	vi.stubGlobal("BroadcastChannel", FakeBroadcastChannel);
});

test.afterEach(() => {
	vi.unstubAllGlobals();
});

test("post | sends the sync message on the channel", async () => {
	const MultitabSync = await freshMultitabSync();
	MultitabSync.post();

	expect(FakeBroadcastChannel.instances).toHaveLength(1);
	expect(FakeBroadcastChannel.instances[0].posted).toEqual(["db-changed"]);
});

test("post | reuses one channel across calls", async () => {
	const MultitabSync = await freshMultitabSync();
	MultitabSync.post();
	MultitabSync.post();

	expect(FakeBroadcastChannel.instances).toHaveLength(1);
	expect(FakeBroadcastChannel.instances[0].posted).toHaveLength(2);
});

test("postReload | sends the reload message on the channel", async () => {
	const MultitabSync = await freshMultitabSync();
	MultitabSync.postReload();

	expect(FakeBroadcastChannel.instances[0].posted).toEqual(["reload"]);
});

test("subscribe | handler receives known messages and ignores others", async () => {
	const MultitabSync = await freshMultitabSync();
	const handler = vi.fn();
	MultitabSync.subscribe(handler);

	const channel = FakeBroadcastChannel.instances[0];
	channel.emit("db-changed");
	channel.emit("reload");
	channel.emit("unrelated");

	expect(handler).toHaveBeenCalledTimes(2);
	expect(handler).toHaveBeenNthCalledWith(1, "db-changed");
	expect(handler).toHaveBeenNthCalledWith(2, "reload");
});

test("subscribe | unsubscribe stops the handler", async () => {
	const MultitabSync = await freshMultitabSync();
	const handler = vi.fn();
	const unsubscribe = MultitabSync.subscribe(handler);

	unsubscribe();
	FakeBroadcastChannel.instances[0].emit("db-changed");

	expect(handler).not.toHaveBeenCalled();
});

test("no BroadcastChannel | post and subscribe degrade to no-ops", async () => {
	vi.stubGlobal("BroadcastChannel", undefined);
	const MultitabSync = await freshMultitabSync();

	expect(() => MultitabSync.post()).not.toThrow();
	const unsubscribe = MultitabSync.subscribe(vi.fn());
	expect(() => unsubscribe()).not.toThrow();
});
