import { TimePage } from 'app/(pages)/time/time';
import { fetchBoxOfficeInfinite, fetchBoxOfficeSummary } from 'lib/fetch/box';
import { getLastDayofMonth } from 'lib/utils/dates';

export async function generateMetadata({
	params,
}: {
	params: { year: number; month: string };
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
	params: { year: number; month: number };
}) {
	// Build Dates based on existing params or defaults.
	const start = new Date(params.year, params.month - 1, 1);
	const end = new Date(
		params.year,
		params.month - 1,
		getLastDayofMonth(params.month)
	);

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
			year={params.year}
			month={params.month}
			results={results}
			timeComparisonData={timeComparisonData.results}
		/>
	);
}
