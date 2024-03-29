import { TimePage } from '@/app/(time)/time/time';
import {
	fetchBoxOfficeInfinite,
	fetchBoxOfficeSummary,
} from '@/lib/api/dataFetching';

export async function generateMetadata({
	params,
}: {
	params: { year: number };
}) {
	const title = `${params.year} | Box Office Data`;
	const description = `${params.year} | Box Office Data`;

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
	params: { year: string };
	searchParams: { country: string; distributor: string };
}) {
	// Build Dates based on existing params or defaults.
	const start = new Date(parseInt(params.year), 0, 1);
	const countries = searchParams?.country?.split(',').map(Number);
	const distributors = searchParams?.distributor?.split(',').map(Number);

	// Check if the passed year is the current year
	const currentYear = new Date().getFullYear();
	const end =
		parseInt(params.year) === currentYear
			? new Date()
			: new Date(parseInt(params.year), 11, 31);

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
			results={results}
			timeComparisonData={timeComparisonData.results}
		/>
	);
}
