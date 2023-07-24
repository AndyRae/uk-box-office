import { TimePage } from 'app/(pages)/time/time';
import {
	fetchBoxOfficeInfinite,
	fetchBoxOfficeSummary,
} from 'lib/dataFetching';
import { getLastDayofMonth } from 'lib/utils/dates';

export async function generateMetadata({
	params,
}: {
	params: { year: string; quarter: string };
}) {
	const title = `Q${params.quarter} ${params.year} | Box Office Data`;
	const description = `Q${params.quarter} ${params.year} | Box Office Data`;

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
	params: { year: string; quarter: number };
}): Promise<JSX.Element> {
	// Build Dates based on existing params or defaults.
	const month = params.quarter * 3 - 2;
	const endMonth = params.quarter * 3;

	const start = new Date(parseInt(params.year), month - 1, 1);
	const end = new Date(
		parseInt(params.year),
		endMonth - 1,
		getLastDayofMonth(endMonth)
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
			year={parseInt(params.year)}
			quarter={params.quarter}
			results={results}
			timeComparisonData={timeComparisonData.results}
		/>
	);
}
