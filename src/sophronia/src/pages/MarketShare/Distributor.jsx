import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { useDistributorMarketShare } from '../../api/distributors';
import { MarketShareChart } from '../../components/Distributor/MarketShareChart';
import { PageTitle } from '../../components/ui/PageTitle';
import { ExportCSV } from '../../components/ui/ExportCSV';
import { MarketShareTable } from '../../components/Distributor/MarketShareTable';
import { Tab, Tabs, TabContent, TabTitle } from '../../components/ui/Tabs';
import { Card } from '../../components/Dashboard/Card';

const MarketShareDistributorPage = () => {
	const { data, error } = useDistributorMarketShare();

	const uniqueYears = [...new Set(data.results.map((d) => d.year))];

	// the total for each year
	const yearsTotal = data.results.reduce((acc, curr) => {
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

	var colors = [
		'#fe7e6d',
		'#fc9b89',
		'#f8b6a5',
		'#f2cfc0',
		'#ede7d8',
		'#d8d3e8',
		'#aeaae8',
		'#7f83de',
		'#4c61c6',
		'#17439b',
	];

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
		<div>
			<PageTitle>Distributor Market Share</PageTitle>

			<div className='my-10'>
				{data && (
					<Card>
						<MarketShareChart uniqueYears={uniqueYears} graphData={graphData} />
					</Card>
				)}
			</div>

			<Tabs>
				{uniqueYears.map((year) => {
					return <TabTitle key={year}>{year}</TabTitle>;
				})}
			</Tabs>

			<TabContent>
				{uniqueYears.map((year) => {
					var yearlyData = reducedData
						.map((d) => {
							return {
								name: d.distributor,
								slug: d.distributor.toLowerCase().replace(/ /g, '-'),
								marketShare: d.years.find((y) => y.year === year).marketShare,
								marketPercentage: d.years.find((y) => y.year === year)
									.marketPercentage,
							};
						})
						.sort((a, b) => b.marketShare - a.marketShare)
						.slice(0, 10);

					return (
						<Tab key={year}>
							<h2 className=''>{year}</h2>
							<ExportCSV
								data={yearlyData}
								filename={`${year}-distributor-market-share.csv`}
							/>
							<MarketShareTable data={yearlyData} />
						</Tab>
					);
				})}
			</TabContent>
		</div>
	);
};

export const MarketShareDistributor = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<MarketShareDistributorPage />
		</Suspense>
	);
};
