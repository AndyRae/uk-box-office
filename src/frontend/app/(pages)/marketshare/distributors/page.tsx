import { PageTitle } from '@/components/custom/page-title';
import { ExportCSV } from '@/components/custom/export-csv';
import { MarketShareChart } from '@/components/charts/market-share';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getDefaultColorArray } from '@/lib/helpers/colorGenerator';

import MarketShare from '@/interfaces/MarketShare';
import { Metadata } from 'next';
import { fetchMarketshare } from '@/lib/api/dataFetching';
import { DataTable } from '@/components/vendor/data-table';
import { columns } from '@/components/tables/market-share';

export const metadata: Metadata = {
	title: 'Distributor Market Share | Box Office Data',
	description: 'UK Box Office market share for Distributors.',
};

export default async function Page() {
	const data = await fetchMarketshare();

	// Map data to unique years.
	const numberOfTopDistributors = 12;
	const uniqueYears = [
		...new Set(data?.results.flatMap((d) => d.years?.map((y) => y.year))),
	].sort();

	// Sort the data by total market share in descending order
	const sortedData = data ? [...data.results] : [];
	sortedData.sort((a, b) => {
		const aTotal = a.years?.reduce((acc, curr) => acc + curr.market_share, 0);
		const bTotal = b.years?.reduce((acc, curr) => acc + curr.market_share, 0);
		return bTotal - aTotal;
	});

	let colors = getDefaultColorArray(numberOfTopDistributors);

	// Select the top n distributors
	const top = sortedData.slice(0, numberOfTopDistributors);

	const graphData = top.map((distributor) => {
		const randomColor = colors.shift();
		const reduced = uniqueYears.map((year) => {
			const yearData = distributor.years?.find((d) => d.year === year);
			return {
				year,
				marketPercentage: yearData ? yearData.market_share : 0,
			};
		});
		return {
			label: distributor.distributor.name,
			data: reduced.map((d) => d.marketPercentage),
			fill: true,
			backgroundColor: randomColor,
			borderColor: randomColor,
		};
	});

	return (
		<>
			<PageTitle>Distributor Market Share</PageTitle>

			<div className='my-10'>
				{data && (
					<MarketShareChart uniqueYears={uniqueYears} graphData={graphData} />
				)}
			</div>

			<Tabs defaultValue={uniqueYears[0]?.toString()}>
				<TabsList>
					{uniqueYears.map((year) => {
						return (
							<TabsTrigger key={year} value={year?.toString()}>
								{year}
							</TabsTrigger>
						);
					})}
				</TabsList>

				{uniqueYears.map((year) => {
					const yearlyData = top
						.map((d: MarketShare) => {
							return {
								name: d.distributor.name,
								slug: d.distributor.slug.toLowerCase().replace(/ /g, '-'),
								marketShare: d.years?.find((y) => y.year === year)?.gross,
								marketPercentage: d.years?.find((y) => y.year === year)
									?.market_share,
							};
						})
						.slice(0, numberOfTopDistributors);

					return (
						<TabsContent value={year?.toString()}>
							<div className='flex flex-row-reverse mt-3'>
								{/* <ExportCSV
									data={yearlyData}
									filename={`${year}-distributor-market-share.csv`}
									className='mb-3'
								/> */}
							</div>
							<DataTable columns={columns} data={yearlyData} />
						</TabsContent>
					);
				})}
			</Tabs>
		</>
	);
}
