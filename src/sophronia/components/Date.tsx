import { parseISO, format } from 'date-fns';

/**
 * Date component
 * @description Simple component to display a date.
 * @param {props} props - Component props
 * @param {string} props.dateString - The date to display.
 * @returns {JSX.Element}
 * @example
 * <Date dateString='2021-01-01' />
 */
export const Date = ({ dateString }: { dateString: string }): JSX.Element => {
	const date = parseISO(dateString);
	return (
		<time suppressHydrationWarning dateTime={dateString}>
			{format(date, 'dd/MM/yyyy')}
		</time>
	);
};

/**
 * Date component
 * @description Simple component to display a date time.
 * @param {props} props - Component props
 * @param {string} props.dateString - The date to display.
 * @returns {JSX.Element}
 * @example
 * <Date dateString='2021-01-01' />
 */
export const DateTime = ({
	dateString,
}: {
	dateString: string;
}): JSX.Element => {
	const date = parseISO(dateString);
	return (
		<time suppressHydrationWarning dateTime={dateString}>
			{format(date, 'dd/MM/yyyy HH:mm:ss')}
		</time>
	);
};
