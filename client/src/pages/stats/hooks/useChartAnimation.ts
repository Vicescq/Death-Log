import type { EChartsOption } from "echarts";
import { useEffect, useState } from "react";
import { delay } from "../../../utils/general";

/**
 * Forces echarts engine to animate on first load - it only loads if there is a diff
 * in data: {} -> actual data
 * @param optionToSet
 * @returns
 */
export default function useChartAnimation(optionToSet: EChartsOption | null) {
	const [option, setOption] = useState<EChartsOption | null>({});

	useEffect(() => {
		if (optionToSet === null) {
			setOption(null);
			return;
		}
		const id = setTimeout(() => setOption(optionToSet), 25);
		return () => clearTimeout(id);
	}, [optionToSet]);

	return option;
}
