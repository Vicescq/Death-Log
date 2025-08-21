import useHistoryContext from "../contexts/useHistoryContext";
import useTreeContext from "../contexts/useTreeContext";
import useUserContext from "../contexts/useUserContext";

export default function useMainPageContexts() {
    const [tree, setTree] = useTreeContext();
    const [history, setHistory] = useHistoryContext();
    const [user, setUser] = useUserContext()
    return {tree, setTree, history, setHistory, user, setUser}
}