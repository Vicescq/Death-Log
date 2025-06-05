import { type ReactNode, useReducer, useState } from "react";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import { type TreeStateType, TreeContext } from "./treeContext";
import { URLMapContext, type URLMapStateType } from "./urlMapContext";
import { useAuth } from "@clerk/clerk-react";
import { HistoryContext, type HistoryStateType } from "./historyContext";
import useGetDeathLog from "../hooks/useGetDeathLog";
import NavBar from "../components/NavBar";
import useLoadUserID from "../hooks/useLoadUserID";
import APIService from "../services/APIService";
import treeReducer from "../reducers/treeReducer";
import { UUIDContext } from "./uuidContext";
import type { Action } from "../model/Action";

export function ContextWrapper({ children }: { children: ReactNode }) {
	const { isLoaded, userId } = useAuth();

	const [tree, dispatchTree] = useReducer<TreeStateType, [action: Action]>(
		treeReducer,
		new Map(),
	);

	const [urlMap, setURLMap] = useState<URLMapStateType>(new Map());

	const initHistory = {
		newActionStartIndex: 0,
		actionHistory: [],
	} as HistoryStateType;
	const [history, setHistory] = useState<HistoryStateType>(initHistory);

	const [uuid, setUUID] = useState(userId);

	useLoadUserID(isLoaded, userId, setUUID);
	useGetDeathLog(uuid, dispatchTree);

	useConsoleLogOnStateChange(tree, "TREE: ", tree);
	useConsoleLogOnStateChange(urlMap, "URL MAP: ", urlMap);
	useConsoleLogOnStateChange(history, "HISTORY: ", history);
	useConsoleLogOnStateChange(
		history,
		"\nSANITIZED: ",
		APIService.batchHistory(history),
	);
	useConsoleLogOnStateChange(
		history.newActionStartIndex,
		"INDEX:",
		history.newActionStartIndex,
	);
	useConsoleLogOnStateChange(uuid, "UUID:", uuid);

	if (isLoaded && userId) {
		return (
			<TreeContext.Provider value={[tree, dispatchTree]}>
				<URLMapContext.Provider value={[urlMap, setURLMap]}>
					<HistoryContext.Provider value={[history, setHistory]}>
						<UUIDContext.Provider value={[uuid, setUUID]}>
							{children}
						</UUIDContext.Provider>
					</HistoryContext.Provider>
				</URLMapContext.Provider>
			</TreeContext.Provider>
		);
	} else {
		return <NavBar />;
	}
}
