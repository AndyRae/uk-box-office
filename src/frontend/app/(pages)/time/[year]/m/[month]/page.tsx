import { TimePage } from '@/app/(pages)/time/time';
import {
	fetchBoxOfficeInfinite,
	fetchBoxOfficeSummary,
} from '@/lib/api/dataFetching';
import { getLastDayofMonth } from '@/lib/helpers/dates';

export async function generateMetadata({
	params,
}: {
	params: { year: string; month: string };
}) {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	const m = parseInt(params.month);

	const title = `${months[m - 1]} ${params.year} | Box Office Data`;
	const description = `${months[m - 1]} ${params.year} | Box Office Data`;

	return {
		title: title,
		twitter: {
			title: title,
			description: description,
			card: 'summary',
			creator: '@AndyRae_',
			images: ['/icons/1.png'],
		},
		openGraph: {
			title: title,
			description: description,
			url: 'https://boxofficedata.co.uk',
			siteName: title,
			images: [
				{
					url: 'icons/1.png',
					width: 800,
					height: 600,
				},
			],
			locale: 'en-GB',
			type: 'website',
		},
	};
}

export default async function Page({
	params,
}: {
	params: { year: string; month: string };
}) {
	// Build Dates based on existing params or defaults.
	const start = new Date(parseInt(params.year), parseInt(params.month) - 1, 1);

	// Check if the passed year and month are the current year and current month
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;
	const isCurrentYear = parseInt(params.year) === currentYear;
	const isCurrentMonth =
		isCurrentYear && parseInt(params.month) === currentMonth;

	// Adjust the end date based on whether it's the current year and current month
	let end: Date;
	if (isCurrentMonth) {
		end = new Date(); // Set the end date to today if it's the current month
	} else {
		end = new Date(
			parseInt(params.year),
			parseInt(params.month) - 1,
			getLastDayofMonth(parseInt(params.month))
		); // Set the end date to the last day of the specified month
	}
	console.log(isCurrentMonth);

	// Build Date Strings for API
	const startDate = `${start.getFullYear()}-${
		start.getMonth() + 1
	}-${start.getDate()}`;
	const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;

	// Fetch data
	const { results, isReachedEnd, percentFetched } =
		await fetchBoxOfficeInfinite(startDate, endDate);
	const timeComparisonData = await fetchBoxOfficeSummary(
		startDate,
		endDate,
		25 // Years to go back.
	);

	return (
		<TimePage
			year={parseInt(params.year)}
			month={parseInt(params.month)}
			results={results}
			timeComparisonData={timeComparisonData.results}
		/>
	);
}
