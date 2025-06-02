import { type ReactNode, useState } from "react";
import useConsoleLogOnStateChange from "../hooks/useConsoleLogOnStateChange";
import { type TreeStateType, TreeContext } from "./treeContext";
import { URLMapContext, type URLMapStateType } from "./urlMapContext";
import { useAuth } from "@clerk/clerk-react";
import { HistoryContext, type HistoryStateType } from "./historyContext";
import useGetDeathLog from "../hooks/useGetDeathLog";
import NavBar from "../components/NavBar";
import useLoadUserID from "../hooks/useLoadUserID";
import APIService from "../services/APIService";

export function ContextWrapper({ children }: { children: ReactNode }) {
	const { isLoaded, userId } = useAuth();

	const [tree, setTree] = useState<TreeStateType>(new Map());
	const [urlMap, setURLMap] = useState<URLMapStateType>(new Map());

	const initHistory = {
		uuid: userId,
		newActionStartIndex: 0,
		actionHistory: [],
	} as HistoryStateType;
	const [history, setHistory] = useState<HistoryStateType>(initHistory);

	useGetDeathLog(userId, setTree, setURLMap);
	useLoadUserID(isLoaded, userId, history, setHistory);

	useConsoleLogOnStateChange(tree, "TREE: ", tree);
	useConsoleLogOnStateChange(urlMap, "URL MAP: ", urlMap);
	useConsoleLogOnStateChange(history, "HISTORY: ", history);
	useConsoleLogOnStateChange(
		history,
		"\nSANITIZED: ",
		APIService.deduplicateHistory(history),
	);
	useConsoleLogOnStateChange(
		history.newActionStartIndex,
		"INDEX:",
		history.newActionStartIndex,
	);

	if (isLoaded && userId) {
		return (
			<TreeContext.Provider value={[tree, setTree]}>
				<URLMapContext.Provider value={[urlMap, setURLMap]}>
					<HistoryContext.Provider value={[history, setHistory]}>
						{children}
					</HistoryContext.Provider>
				</URLMapContext.Provider>
			</TreeContext.Provider>
		);
	} else {
		return <NavBar />;
	}
}
