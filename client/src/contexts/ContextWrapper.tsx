import { type ReactNode, useEffect, useState } from "react";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import { type TreeStateType, TreeContext } from "./treeContext";
import { URLMapContext, type URLMapStateType } from "./urlMapContext";
import { HistoryContext, type HistoryStateType } from "./historyContext";
import useGetDeathLog from "../hooks/useGetDeathLog";
import HistoryContextManager from "../features/HistoryContextManager";
import IndexedDBService from "../services/IndexedDBService";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
	UserContext,
	type UserContextType,
	type UserStateType,
} from "./userContext";
import { auth } from "../firebase-config";
import useLoadUserSession from "../hooks/useLoadUserSession";

export function ContextWrapper({ children }: { children: ReactNode }) {
	const [tree, setTree] = useState<TreeStateType>(new Map());

	const [urlMap, setURLMap] = useState<URLMapStateType>(new Map());

	const initHistory = {
		newActionStartIndex: 0,
		actionHistory: [],
	} as HistoryStateType;
	const [history, setHistory] = useState<HistoryStateType>(initHistory);

	const [user, setUser] = useState<UserStateType>(null);

	// useGetDeathLog(uuid, tree, setTree);

	useConsoleLogOnStateChange(tree, "TREE: ", tree);
	useConsoleLogOnStateChange(urlMap, "URL MAP: ", urlMap);
	useConsoleLogOnStateChange(history, "HISTORY: ", history);
	useConsoleLogOnStateChange(
		history,
		"\nSENT TO DB: ",
		HistoryContextManager.batchHistory(history),
	);
	useConsoleLogOnStateChange(
		history.newActionStartIndex,
		"INDEX:",
		history.newActionStartIndex,
	);
	useConsoleLogOnStateChange(user, "USER:", user);

	useLoadUserSession(setUser);

	return (
		<TreeContext.Provider value={[tree, setTree]}>
			<URLMapContext.Provider value={[urlMap, setURLMap]}>
				<HistoryContext.Provider value={[history, setHistory]}>
					<UserContext.Provider value={[user, setUser]}>
						{children}
					</UserContext.Provider>
				</HistoryContext.Provider>
			</URLMapContext.Provider>
		</TreeContext.Provider>
	);
}
