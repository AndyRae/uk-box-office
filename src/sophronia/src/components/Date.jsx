import { parseISO, format } from 'date-fns';

/**
 * Date component
 * @description Simple component to display a date.
 * @param {string} dateString - The date to display.
 * @returns {JSX.Element}
 * @example
 * <Date dateString='2021-01-01' />
 */
export const Date = ({ dateString }) => {
	const date = parseISO(dateString);
	return <time dateTime={dateString}>{format(date, 'dd/MM/yyyy')}</time>;
};
