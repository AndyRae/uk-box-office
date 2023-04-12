export function getLastDayofMonth(month: number) {
	const d = new Date(2023, month, 0);
	return d.getDate();
}
