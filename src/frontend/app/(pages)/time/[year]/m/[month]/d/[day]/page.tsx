import { TimePage } from '@/app/(pages)/time/time';
import {
	fetchBoxOfficeInfinite,
	fetchBoxOfficeSummary,
} from '@/lib/api/dataFetching';
import addDays from 'date-fns/addDays';

export async function generateMetadata({
	params,
}: {
	params: { year: number; month: string; day: number };
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

	const title = `${params.day} ${months[m - 1]} ${
		params.year
	} | Box Office Data`;
	const description = `${params.day} ${months[m - 1]} ${
		params.year
	} | Box Office Data`;

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
	searchParams,
}: {
	params: { year: string; month: number; day: number };
	searchParams: { country: string; distributor: string };
}) {
	const countries = searchParams?.country?.split(',').map(Number);
	const distributors = searchParams?.distributor?.split(',').map(Number);
	// Build Dates based on existing params or defaults.
	const start = new Date(parseInt(params.year), params.month - 1, params.day);
	const sLastWeek = addDays(start, -7);

	// Build Date Strings for API
	const startDate = `${start.getFullYear()}-${
		start.getMonth() + 1
	}-${start.getDate()}`;

	const startLastWeek = `${sLastWeek.getFullYear()}-${
		sLastWeek.getMonth() + 1
	}-${sLastWeek.getDate()}`;

	// Fetch Data
	const { results, isReachedEnd, percentFetched } =
		await fetchBoxOfficeInfinite(startDate, startDate, distributors, countries);
	const { results: lastWeekResults } = await fetchBoxOfficeInfinite(
		startLastWeek,
		startLastWeek,
		distributors,
		countries
	);
	const timeComparisonData = await fetchBoxOfficeSummary(
		startDate,
		startDate,
		25 // Years to go back.
	);

	return (
		<TimePage
			year={parseInt(params.year)}
			month={params.month}
			day={params.day}
			results={results}
			lastWeekResults={lastWeekResults}
			timeComparisonData={timeComparisonData.results}
		/>
	);
}
