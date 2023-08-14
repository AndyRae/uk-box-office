export function getLastDayofMonth(month: number) {
	const d = new Date(2023, month, 0);
	return d.getDate();
}

/**
 * Parses a date object to a ISO date string
 * @param input Date object to parse
 * @returns The ISO date string
 */
export const parseDate = (input: Date): string => {
	const year = input.getFullYear().toString();
	const month = (input.getMonth() + 1).toString().padStart(2, '0');
	const day = input.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};
