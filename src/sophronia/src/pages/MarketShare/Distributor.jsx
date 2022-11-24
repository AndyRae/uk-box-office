import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { useDistributorMarketShare } from '../../api/distributors';
import { MarketShareChart } from '../../components/Distributor/MarketShareChart';
import { PageTitle } from '../../components/ui/PageTitle';
import { ExportCSV } from '../../components/ui/ExportCSV';
import { MarketShareTable } from '../../components/Distributor/MarketShareTable';
import { Tabs } from '../../components/ui/Tabs';
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
		'#650033',
		'#98335f',
		'#c8658d',
		'#f197be',
		'#fbc6de',
		'#ced6fb',
		'#a2b1f6',
		'#6c81d9',
		'#3654af',
		'#002a7c',
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

			<Tabs
				tabs={uniqueYears.map((year, index) => ({
					title: year,
					id: index,
				}))}
			>
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
						<div key={year}>
							<div className='flex flex-row-reverse mt-3'>
								<ExportCSV
									data={yearlyData}
									filename={`${year}-distributor-market-share.csv`}
								/>
							</div>
							<MarketShareTable data={yearlyData} />
						</div>
					);
				})}
			</Tabs>
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
