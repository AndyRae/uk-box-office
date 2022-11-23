import { Timeseries } from '../charts/Timeseries';

export const MarketShareChart = ({ uniqueYears, graphData }) => {
	const d = {
		labels: uniqueYears.reverse(),
		datasets: graphData,
	};
	const options = {
		responsive: true,
		maintainAspectRatio: false,
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
	return <Timeseries data={d} options={options} />;
};
