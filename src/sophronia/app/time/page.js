import { getBackendURL } from 'lib/ApiFetcher';

import { YearsTable } from 'components/Time/YearsTable';
// import { ExportCSV } from 'components/ui/ExportCSV';
import { AllTimeChart } from 'components/Time/AllTimeChart';
import { StructuredTimeData } from 'components/StructuredData';
import { PageTitle } from 'components/ui/PageTitle';
import { PageContent } from 'components/ui/PageContent';
import { Card } from 'components/Dashboard/Card';

export async function getBoxOfficeSummary(startDate, endDate, limit) {
	const url = getBackendURL();
	const res = await fetch(
		`${url}boxoffice/summary?start=${startDate}&end=${endDate}&limit=${limit}`,
		{ cache: 'no-store' }
	);
	return res.json();
}

export default async function Page() {
	// Get the current year.
	const today = new Date().getFullYear();
	const startDate = `${today}-${1}-${1}`;
	const endDate = `${today}-${12}-${31}`;

	// Look back 25 years.
	const yearsToLookBack = 22;
	const data = await getBoxOfficeSummary(startDate, endDate, yearsToLookBack);

	// Reverse for the graph so to be left to right.
	const reversedData = data?.results.slice().reverse();
	return (
		<>
			{/* <StructuredTimeData
					title='All Time Box Office'
					endpoint='/time'
					time={`2001 - ${today}`}
				/> */}
			<PageTitle>All Time Box Office</PageTitle>

			<Card>
				<AllTimeChart data={reversedData} />
			</Card>

			<div className='my-5 max-w-xl'>
				<Card>
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
					</PageContent>
				</Card>
			</div>

			{/* <ExportCSV data={data.results} filename={'alltime.csv'} /> */}
			<YearsTable data={data.results} id={'yearstable'} />
		</>
	);
}
