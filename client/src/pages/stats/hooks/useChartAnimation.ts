import type { EChartsOption } from "echarts";
import { useEffect, useState } from "react";
import { delay } from "../../../utils/general";

/**
 * Forces echarts engine to animate on first load - it only loads if there is a diff
 * in data: {} -> actual data
 * @param optionToSet
 * @returns
 */
export default function useChartAnimation(optionToSet: EChartsOption) {
	const [option, setOption] = useState<EChartsOption>({});

	useEffect(() => {
		delay(25).then(() => setOption(optionToSet));
	}, [optionToSet]);

	return option;
}
