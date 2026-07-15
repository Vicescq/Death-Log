const CHANNEL_NAME = "death-log-sync";
const DB_CHANGED = "db-changed";
const RELOAD = "reload";

export type MultitabMessage = typeof DB_CHANGED | typeof RELOAD;

export class MultitabSync {
	private static channel: BroadcastChannel | null = null;

	private static getChannel(): BroadcastChannel | null {
		if (typeof BroadcastChannel === "undefined") return null;
		if (MultitabSync.channel == null) {
			MultitabSync.channel = new BroadcastChannel(CHANNEL_NAME);
		}
		return MultitabSync.channel;
	}

	static post() {
		MultitabSync.getChannel()?.postMessage(DB_CHANGED);
	}

	static postReload() {
		MultitabSync.getChannel()?.postMessage(RELOAD);
	}

	static subscribe(handler: (message: MultitabMessage) => void): () => void {
		const channel = MultitabSync.getChannel();
		if (channel == null) return () => {};

		const onMessage = (event: MessageEvent) => {
			if (event.data === DB_CHANGED || event.data === RELOAD) {
				handler(event.data);
			}
		};
		channel.addEventListener("message", onMessage);
		return () => channel.removeEventListener("message", onMessage);
	}
}
