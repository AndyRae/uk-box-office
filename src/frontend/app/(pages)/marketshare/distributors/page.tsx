import { PageTitle } from 'components/ui/page-title';
import { ExportCSV } from 'components/ui/export-csv';
import { MarketShareChart } from 'components/charts/market-share';
import { MarketShareTable } from 'components/tables/market-share-table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'components/ui/tabs';
import { getDefaultColorArray } from 'lib/utils/colorGenerator';

import MarketShare from 'interfaces/MarketShare';
import { Metadata } from 'next';
import { fetchMarketshare } from 'lib/dataFetching';

export const metadata: Metadata = {
	title: 'Distributor Market Share | Box Office Data',
	description: 'UK Box Office market share for Distributors.',
};

export default async function Page() {
	const data = await fetchMarketshare();

	// Map data to unique years.
	const uniqueYears = [...new Set(data.results.map((d) => d.year))];

	// the total for each year
	const yearsTotal = data.results.reduce((acc: any, curr: any) => {
		if (acc[curr.year]) {
			acc[curr.year] += curr.gross;
		} else {
			acc[curr.year] = curr.gross;
		}
		return acc;
	}, {});

	// reduce the data to a single object for each distributor
	const uniqueDistributors = [
		...new Set(data.results.map((d) => d.distributor.name)),
	];

	// reduce the data to a single array for each distributor
	const reducedData = uniqueDistributors.map((distributor) => {
		const distributorData = data.results.filter(
			(d) => d.distributor.name === distributor
		);
		const reduced = uniqueYears.map((year) => {
			const yearData = distributorData.filter((d) => d.year === year);
			const total = yearData.reduce((acc, curr) => acc + curr.gross, 0);
			return {
				year,
				marketShare: total,
				marketPercentage: total / yearsTotal[year],
			};
		});
		return {
			distributor,
			years: reduced,
		};
	});

	// order the data by market share (we only want the top 10)
	reducedData.sort((a, b) => {
		const aTotal = a.years.reduce((acc, curr) => acc + curr.marketShare, 0);
		const bTotal = b.years.reduce((acc, curr) => acc + curr.marketShare, 0);
		return bTotal - aTotal;
	});

	var colors = getDefaultColorArray(10);

	// construct dataset object for each distributor
	var graphData = reducedData.slice(0, 10).map((d) => {
		var randomColor = colors.shift();
		return {
			label: d.distributor,
			data: d.years.map((d) => d.marketPercentage).reverse(),
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

			<Tabs defaultValue={uniqueYears[0].toString()}>
				<TabsList>
					{uniqueYears.map((year) => {
						return (
							<TabsTrigger key={year} value={year.toString()}>
								{year}
							</TabsTrigger>
						);
					})}
				</TabsList>

				{uniqueYears.map((year) => {
					const yearlyData = reducedData
						.map((d: any) => {
							return {
								name: d.distributor,
								slug: d.distributor.toLowerCase().replace(/ /g, '-'),
								marketShare: d.years.find((y: MarketShare) => y.year === year)
									.marketShare,
								marketPercentage: d.years.find(
									(y: MarketShare) => y.year === year
								).marketPercentage,
							};
						})
						.sort((a, b) => b.marketShare - a.marketShare)
						.slice(0, 10);

					return (
						<TabsContent value={year.toString()}>
							<div className='flex flex-row-reverse mt-3'>
								<ExportCSV
									data={yearlyData}
									filename={`${year}-distributor-market-share.csv`}
									className='mb-3'
								/>
							</div>
							<MarketShareTable data={yearlyData} />
						</TabsContent>
					);
				})}
			</Tabs>
		</>
	);
}
