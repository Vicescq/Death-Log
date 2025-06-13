import { useErrorBoundary } from "react-error-boundary";
import useHistoryContext from "../contexts/useHistoryContext";
import useTreeContext from "../contexts/useTreeContext";
import useURLMapContext from "../contexts/useURLMapContext";

export default function useMainPageContexts() {
    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const [history, setHistory] = useHistoryContext();
    const { showBoundary } = useErrorBoundary();
    return {tree, setTree, urlMap, setURLMap, history, setHistory, showBoundary}
}