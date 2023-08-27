import { PageTitle } from '@/components/custom/page-title';
import { PageContent } from '@/components/custom/page-content';
import { ExportCSV } from '@/components/custom/export-csv';
import { StructuredTimeData } from '@/components/structured-data';
import { AllTimeChart } from '@/components/charts/all-time';
import { columns } from '@/components/tables/years';
import { DataTable } from '@/components/vendor/data-table';

import { Metadata } from 'next';
import { fetchBoxOfficeSummary } from '@/lib/api/dataFetching';
import { calculateTimeChange } from '../../../lib/helpers/groupData';

export const metadata: Metadata = {
	title: 'All Time Box Office 2001 - 2023 | Box Office Data',
	description:
		'Get all time box office data for the UK film industry. Including dashboards, statistics, reports, and analysis.',
};

export default async function Page(): Promise<JSX.Element> {
	// Get the current year.
	const today = new Date().getFullYear();
	const startDate = `${today}-${1}-${1}`;
	const endDate = `${today}-${12}-${31}`;

	// Look back 25 years.
	const yearsToLookBack = 43;
	const data = await fetchBoxOfficeSummary(startDate, endDate, yearsToLookBack);

	// Reverse for the graph so to be left to right.
	const reversedData = data?.results.slice().reverse();

	const transformedData = calculateTimeChange(data.results);
	return (
		<>
			<StructuredTimeData
				title='All Time Box Office'
				endpoint='/time'
				time={`2001 - ${today}`}
			/>
			<PageTitle>All Time Box Office</PageTitle>

			<AllTimeChart data={reversedData} />

			<div className='my-5 max-w-xl'>
				<PageContent>
					<h3 className='text-2xl font-bold mb-3 dark:text-white'>
						Why are these numbers different to ____?
					</h3>

					<hr></hr>

					<p>
						These overall numbers will be different to other sources, such as
						the BFI and other industry bodies. Which often publish different
						numbers between them.
					</p>
					<p>
						The key difference is that this website has public attributable
						data, meaning that the overall data like this is still linked to
						specific films and weeks. So we can be transparent about how the
						overall numbers are calculated, rather than just publishing a
						number.
					</p>
					<p>
						*Data prior to September 2001 becomes more incomplete the further
						you go back, and before 1990 is very sparse.
					</p>
				</PageContent>
			</div>

			<hr className='my-10' />
			<div className='mb-5'>
				<ExportCSV data={data.results} filename={'alltime.csv'} />
			</div>
			<DataTable columns={columns} data={transformedData} />
		</>
	);
}
