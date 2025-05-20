import { useState } from "react";

export type URLMap = Map<string, (number | undefined)[]>;

export default function useURLMapper(){
    const [urlMap, setURLMap] = useState<URLMap>(new Map());
    


    return urlMap;
}