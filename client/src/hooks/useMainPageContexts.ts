import useHistoryContext from "../contexts/useHistoryContext";
import useTreeContext from "../contexts/useTreeContext";
import useURLMapContext from "../contexts/useURLMapContext";
import useUserContext from "../contexts/useUserContext";

export default function useMainPageContexts() {
    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const [history, setHistory] = useHistoryContext();
    const [user, setUser] = useUserContext()
    return {tree, setTree, urlMap, setURLMap, history, setHistory, user, setUser}
}