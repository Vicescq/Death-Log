import type { EChartsOption } from "echarts";
import { useEffect, useState } from "react";
import { delay } from "../../../utils/general";

export default function useChartAnimation(optionToSet: EChartsOption) {
	const [option, setOption] = useState<EChartsOption>({});

	useEffect(() => {
		delay(25).then(() => setOption(optionToSet));
	}, []);

	return option;
}
