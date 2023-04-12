declare global {
	interface Date {
		addDays(days: number): Date;
	}
}

Date.prototype.addDays = function (days: number): Date {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

export function getLastDayofMonth(year: number, month = 12) {
	const d = new Date(year, month, 0);
	return d.getDate();
}
