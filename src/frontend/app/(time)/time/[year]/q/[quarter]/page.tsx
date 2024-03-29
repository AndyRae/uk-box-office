import { TimePage } from '@/app/(time)/time/time';
import {
	fetchBoxOfficeInfinite,
	fetchBoxOfficeSummary,
} from '@/lib/api/dataFetching';
import { getLastDayofMonth } from '@/lib/helpers/dates';

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
	searchParams,
}: {
	params: { year: string; quarter: string };
	searchParams: { country: string; distributor: string };
}): Promise<JSX.Element> {
	const countries = searchParams?.country?.split(',').map(Number);
	const distributors = searchParams?.distributor?.split(',').map(Number);
	// Build Dates based on existing params or defaults.
	const month = parseInt(params.quarter) * 3 - 2;
	const endMonth = parseInt(params.quarter) * 3;

	const start = new Date(parseInt(params.year), month - 1, 1);

	// Check if the passed year and quarter are the current year and current quarter
	const currentYear = new Date().getFullYear();
	const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);
	const isCurrentYear = parseInt(params.year) === currentYear;
	const isCurrentQuarter =
		isCurrentYear && parseInt(params.quarter) === currentQuarter;

	// Adjust the end date based on whether it's the current year and current quarter
	let end: Date;
	if (isCurrentQuarter) {
		end = new Date(); // Set the end date to today if it's the current quarter
	} else {
		end = new Date(
			parseInt(params.year),
			endMonth - 1,
			getLastDayofMonth(endMonth)
		); // Set the end date to the last day of the specified quarter
	}

	// Build Date Strings for API
	const startDate = `${start.getFullYear()}-${
		start.getMonth() + 1
	}-${start.getDate()}`;
	const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;

	// Fetch data
	let yearsToGoBack = 25;
	// If a filter is applied, don't show comparison data.
	if (countries != undefined || distributors != undefined) {
		yearsToGoBack = 1;
	}

	const { results, isReachedEnd, percentFetched } =
		await fetchBoxOfficeInfinite(startDate, endDate, distributors, countries);
	const timeComparisonData = await fetchBoxOfficeSummary(
		startDate,
		endDate,
		yearsToGoBack
	);

	return (
		<TimePage
			year={parseInt(params.year)}
			quarter={parseInt(params.quarter)}
			results={results}
			timeComparisonData={timeComparisonData.results}
		/>
	);
}
