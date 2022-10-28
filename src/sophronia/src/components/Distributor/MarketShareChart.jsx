import { Timeseries } from '../charts/Timeseries';

export const MarketShareChart = ({ data }) => {
	const uniqueYears = [...new Set(data.map((d) => d.year))];

	// need to reduce the data to a single object for each distributor
	const uniqueDistributors = [...new Set(data.map((d) => d.distributor.name))];

	// need to reduce the data to a single array for each distributor
	const reducedData = uniqueDistributors.map((distributor) => {
		const distributorData = data.filter(
			(d) => d.distributor.name === distributor
		);
		const reduced = uniqueYears.map((year) => {
			const yearData = distributorData.filter((d) => d.year === year);
			const total = yearData.reduce((acc, curr) => acc + curr.gross, 0);
			return {
				year,
				market_share: total,
			};
		});
		return {
			distributor,
			data: reduced,
		};
	});

	console.log(reducedData);

	const d = {
		labels: uniqueYears.reverse(),
		datasets: [{}],
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
