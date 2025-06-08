import { useErrorBoundary } from "react-error-boundary";
import useHistoryContext from "../../hooks/useHistoryContext";
import useTreeContext from "../../hooks/useTreeContext";
import useURLMapContext from "../../hooks/useURLMapContext";
import useUUIDContext from "../../hooks/useUUIDContext";

export default function useHomeStates() {
    const [tree, setTree] = useTreeContext();
    const [urlMap, setURLMap] = useURLMapContext();
    const [history, setHistory] = useHistoryContext();
    const [uuid] = useUUIDContext();
    const { showBoundary } = useErrorBoundary();
    return {tree, setTree, urlMap, setURLMap, history, setHistory, uuid, showBoundary}
}