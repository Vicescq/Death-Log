import { useRegisterSW } from "virtual:pwa-register/react";
import { useAuth } from "@clerk/react";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import { DebugService } from "../services/DebugService";
import { BackupPolicy } from "../services/backup/BackupPolicy";
import ReloadPrompt from "./ReloadPrompt";
import FakeDataBanner from "./FakeDataBanner";
import CRUDCounterBanner from "./CRUDCounterBanner";
import { useAutoBackup } from "../hooks/useAutoBackup";

export default function Banners() {
	// 1st priority
	const {
		needRefresh: [needRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(r) {
			DebugService.log("SW Registered: " + r);
		},
		onRegisterError(error) {
			DebugService.log("SW registration error", error);
		},
	});

	// 2nd priority
	const tree = useDeathLogStore((state) => state.tree);
	const hasFakeData = Array.from(tree.values()).some((node) => node.isFake);

	// 3rd priority
	const crudState = useDeathLogStore((state) => state.crudState);
	const dismissCRUDBanner = useDeathLogStore(
		(state) => state.dismissCRUDBanner,
	);
	const { isLoaded, isSignedIn } = useAuth();

	useAutoBackup();

	const notify = BackupPolicy.notify(
		crudState,
		BackupPolicy.autoBackupActive(
			crudState,
			!isLoaded || isSignedIn,
			hasFakeData,
		),
	);

	if (needRefresh) {
		return <ReloadPrompt onUpdate={() => updateServiceWorker(true)} />;
	}
	if (hasFakeData) {
		return <FakeDataBanner />;
	}
	if (notify) {
		return (
			<CRUDCounterBanner
				backupNotify={notify}
				onDismiss={dismissCRUDBanner}
			/>
		);
	}
	return null;
}
