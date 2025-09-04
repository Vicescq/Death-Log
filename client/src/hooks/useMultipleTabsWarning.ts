import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function useMultipleTabsWarning() {
    const webAppBroadcast = new BroadcastChannel("webApp");
    let navigate = useNavigate();
    const [multipleTabsErr, setMultipleTabsErr] = useState(false);

    useEffect(() => {
        webAppBroadcast.postMessage("newTab");
        webAppBroadcast.onmessage = (event) => {
            if (event.data == "newTab") {
                webAppBroadcast.postMessage("pleaseCloseTab");
            }
            if (event.data == "pleaseCloseTab") {
                setMultipleTabsErr(true);
                webAppBroadcast.close();
            }
        };
    }, []);

    useEffect(() => {
        if (multipleTabsErr) {
            navigate("/__MULTIPLE_TABS__");
        }
    }, [multipleTabsErr]);
}