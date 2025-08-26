import { type ReactNode, useState } from "react";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import { type TreeStateType, TreeContext } from "./treeContext";
import { HistoryContext, type HistoryStateType } from "./historyContext";
import HistoryContextManager from "./managers/HistoryContextManager";
import {
	UserContext,
	type UserStateType,
} from "./userContext";
import useAuthObserver from "../hooks/useAuthObserver";
import useSyncDeathLog from "../hooks/useSyncDeathLog";


export function ContextWrapper({ children }: { children: ReactNode }) {
	const [tree, setTree] = useState<TreeStateType>(new Map());
	const initHistory = {
		newActionStartIndex: 0,
		actionHistory: [],
	} as HistoryStateType;
	const [history, setHistory] = useState<HistoryStateType>(initHistory);
	const [user, setUser] = useState<UserStateType>(null);
	
	useConsoleLogOnStateChange(tree, "TREE: ", tree);
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
	useAuthObserver(setUser, setTree, setHistory);
	useSyncDeathLog(user, history, setHistory);

	return (
		<TreeContext.Provider value={[tree, setTree]}>
				<HistoryContext.Provider value={[history, setHistory]}>
					<UserContext.Provider value={[user, setUser]}>
						{children}
					</UserContext.Provider>
				</HistoryContext.Provider>
		</TreeContext.Provider>
	);
}
