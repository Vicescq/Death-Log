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

	const elapsedTimeRef = useRef(elapsedTime);
	const subjectRef = useRef(subject);
	useEffect(() => {
		elapsedTimeRef.current = elapsedTime;
		subjectRef.current = subject;
	});

	function start() {
		if (!isTracking) {
			setIsTracking(true);
			startTimeRef.current = Date.now() - elapsedTime;
		}
	}

	function stop() {
		if (isTracking) {
			setIsTracking(false);
			const time = formatTime();
			const timeSpent = time == "N / A" ? null : time;
			if (timeSpent !== subject.timeSpent) {
				updateNode({ ...subject, timeSpent });
			}
		}
	}

	function reset() {
		setElapsedTime(0);
		setIsTracking(false);
		if (subject.timeSpent !== null) {
			updateNode({ ...subject, timeSpent: null });
		}
	}

	function formatTime(fromRef = false) {
		const ms = fromRef ? elapsedTimeRef.current : elapsedTime;
		const hrs = Math.floor(ms / (1000 * 60 * 60));
		const mins = Math.floor((ms / (1000 * 60)) % 60);
		const sec = Math.floor((ms / 1000) % 60);

		const result = `${addLeadingZeroes(hrs)}:${addLeadingZeroes(mins)}:${addLeadingZeroes(sec)}`;
		if (result == "00:00:00") {
			return "N / A";
		}

		return result;
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

	useEffect(() => {
		if (!isTracking) {
			setElapsedTime(
				subject.timeSpent != null
					? parseFormattedTime(subject.timeSpent)
					: 0,
			);
		}
	}, [subject.timeSpent, isTracking]);

	useEffect(() => {
		return () => {
			const time = formatTime(true);
			const timeSpent = time == "N / A" ? null : time;
			if (timeSpent !== subjectRef.current.timeSpent) {
				updateNode({ ...subjectRef.current, timeSpent });
			}
		};
	}, []);

	return {
		onStartTracking: start,
		onStopTracking: stop,
		onResetTracking: reset,
		formattedTime: formatTime(),
		isTracking,
	};
}
