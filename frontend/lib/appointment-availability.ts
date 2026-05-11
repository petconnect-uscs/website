
export function localDayKey(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

export function indexBookedHoursByLocalDay(
	bookedDatesIso: string[],
): Map<string, Set<number>> {
	const map = new Map<string, Set<number>>();

	for (const iso of bookedDatesIso) {
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) continue;

		const key = localDayKey(d);
		const hour = d.getHours();

		let set = map.get(key);
		if (!set) {
			set = new Set<number>();
			map.set(key, set);
		}
		set.add(hour);
	}

	return map;
}

export function fullyBookedLocalDayKeys(
	bookedByDay: Map<string, Set<number>>,
): Set<string> {
	const full = new Set<string>();
	for (const [key, hours] of bookedByDay) {
		if (hours.size >= 24) full.add(key);
	}
	return full;
}
