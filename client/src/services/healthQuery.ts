import type { QueryFunctionContext } from "@tanstack/react-query";
import Backend from "./Backend";

export const HEALTH_QUERY_KEY = ["health"];

export async function healthQueryFn({ signal }: QueryFunctionContext) {
	const res = await Backend.checkHealth(signal);
	if (!res.ok) throw new Error();
	return true;
}
