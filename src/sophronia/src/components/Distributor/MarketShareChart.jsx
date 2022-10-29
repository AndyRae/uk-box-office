import { Timeseries } from '../charts/Timeseries';

export const MarketShareChart = ({ data }) => {
	const uniqueYears = [...new Set(data.map((d) => d.year))];

	// the total for each year
	const yearsTotal = data.reduce((acc, curr) => {
		if (acc[curr.year]) {
			acc[curr.year] += curr.gross;
		} else {
			acc[curr.year] = curr.gross;
		}
		return acc;
	}, {});

	// reduce the data to a single object for each distributor
	const uniqueDistributors = [...new Set(data.map((d) => d.distributor.name))];

	// reduce the data to a single array for each distributor
	const reducedData = uniqueDistributors.map((distributor) => {
		const distributorData = data.filter(
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

	const d = {
		labels: uniqueYears.reverse(),
		datasets: graphData,
	};
	const options = {
		scales: {
			x: {
				grid: {
					display: false,
				},
				offset: false,
			},
			y: {
				stacked: true,
				beginAtZero: true,
				ticks: {
					autoSkip: true,
				},
			},
		},
	};
	return (
		<div className='my-10 h-80'>
			<Timeseries data={d} options={options} />
		</div>
	);
};
