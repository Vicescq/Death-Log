import { type ReactNode, useEffect, useState } from "react";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import { type TreeStateType, TreeContext } from "./treeContext";
import { URLMapContext, type URLMapStateType } from "./urlMapContext";
import { HistoryContext, type HistoryStateType } from "./historyContext";
import HistoryContextManager from "../features/HistoryContextManager";
import {
	UserContext,
	type UserContextType,
	type UserStateType,
} from "./userContext";
import { auth } from "../firebase-config";
import useLoadUserSession from "../hooks/useLoadUserSession";
import useGetDeathLog from "../hooks/useGetDeathLog";
import useUpdateURLMap from "../hooks/useUpdateURLMap";

export function ContextWrapper({ children }: { children: ReactNode }) {
	const [loading, setLoading] = useState(true);
	const [tree, setTree] = useState<TreeStateType>(new Map());

	const [urlMap, setURLMap] = useState<URLMapStateType>(new Map());

	const initHistory = {
		newActionStartIndex: 0,
		actionHistory: [],
	} as HistoryStateType;
	const [history, setHistory] = useState<HistoryStateType>(initHistory);

	const [user, setUser] = useState<UserStateType>(null);

	

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
	useGetDeathLog(tree, setTree, user);
	useUpdateURLMap(tree, urlMap, setURLMap);

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
