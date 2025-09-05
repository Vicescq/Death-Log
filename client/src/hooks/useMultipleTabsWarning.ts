import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function useMultipleTabsWarning() {
    let navigate = useNavigate();

    useEffect(() => {
        const webAppBroadcast = new BroadcastChannel("webApp");

        webAppBroadcast.postMessage("newTab");

        webAppBroadcast.onmessage = (event) => {
            if (event.data == "newTab") {
                webAppBroadcast.postMessage("pleaseCloseTab");
            }
            if (event.data == "pleaseCloseTab") {
                navigate("/__MULTIPLE_TABS__");
                webAppBroadcast.close();
            }
        };
        return () => {
            webAppBroadcast.close()
        }

    }, []);
}