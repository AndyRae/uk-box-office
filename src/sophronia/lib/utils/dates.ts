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

export function getLastDayofMonth(month: number) {
	const d = new Date(2023, month, 0);
	return d.getDate();
}
