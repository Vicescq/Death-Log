import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTrueInitLoadStore } from "../stores/useTrueInitLoadStore";

export default function useMultipleTabsWarning() {
    const passInitPhase = useTrueInitLoadStore((state) => state.passInitPhase);
    const trueInitLoad = useTrueInitLoadStore((state) => state.trueInitLoad);
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