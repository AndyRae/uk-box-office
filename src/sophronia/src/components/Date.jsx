import { parseISO, format } from 'date-fns';

export const Date = ({ dateString }) => {
	console.log(dateString);
	let date2 = parseISO('2014-02-11T11:30:30');
	console.log(date2);
	const date = parseISO(dateString);
	console.log(date);
	return <time dateTime={dateString}>{format(date, 'dd/MM/yyyy')}</time>;
};
