import { useEffect } from "react";

export default function useConsoleLogOnStateChange(state: any, ...loggedVal: any){
    useEffect(() => console.log(...loggedVal), [state]);
}