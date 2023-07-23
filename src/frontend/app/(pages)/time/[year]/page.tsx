import { TimePage } from 'app/(pages)/time/time';
import {
	fetchBoxOfficeInfinite,
	fetchBoxOfficeSummary,
} from 'lib/dataFetching';

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

export default async function Page({ params }: { params: { year: string } }) {
	// Build Dates based on existing params or defaults.
	const start = new Date(parseInt(params.year), 0, 1);
	const end = new Date(parseInt(params.year), 11, 31);

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
			results={results}
			timeComparisonData={timeComparisonData}
		/>
	);
}
