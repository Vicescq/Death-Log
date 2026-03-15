import { useEffect, useRef, useState } from "react";
import { addLeadingZeroes } from "../../../utils/date";
import type { Subject } from "../../../model/tree-node-model/SubjectSchema";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";

export default function useTimeTracker(subject: Subject) {
	const updateNode = useDeathLogStore((state) => state.updateNode);

	const [isTracking, setIsTracking] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(
		subject.timeSpent != null ? parseFormattedTime(subject.timeSpent) : 0,
	);
	const startTimeRef = useRef(0);

	function start() {
		setIsTracking(true);
		startTimeRef.current = Date.now() - elapsedTime;
	}

	function stop() {
		setIsTracking(false);
		updateNode({ ...subject, timeSpent: formatTime() });
	}

	function reset() {
		setElapsedTime(0);
		setIsTracking(false);
		updateNode({ ...subject, timeSpent: formatTime() });
	}

	function formatTime() {
		let hrs = Math.floor(elapsedTime / (1000 * 60 * 60));
		let mins = Math.floor((elapsedTime / (1000 * 60)) % 60);
		let sec = Math.floor((elapsedTime / 1000) % 60);

		return `${addLeadingZeroes(hrs)}:${addLeadingZeroes(mins)}:${addLeadingZeroes(sec)}`;
	}

	function parseFormattedTime(formattedTime: string) {
		const [hrs, mins, secs] = formattedTime.split(":").map(Number);

		return hrs * 1000 * 60 * 60 + mins * 1000 * 60 + secs * 1000;
	}

	useEffect(() => {
		if (isTracking) {
			const intervalID = setInterval(() => {
				setElapsedTime(Date.now() - startTimeRef.current);
			}, 100);
			return () => clearInterval(intervalID);
		}
	}, [isTracking]);

	return {
		onStartTracking: start,
		onStopTracking: stop,
		onResetTracking: reset,
		time: formatTime(),
	};
}
