import { Timeseries } from '../charts/Timeseries';

export const MarketShareChart = ({ uniqueYears, graphData }) => {
	const reversed = [...uniqueYears].reverse();

	const d = {
		labels: reversed,
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
				grid: {
					display: false,
					drawBorder: false,
				},
			},
		},
	};
	return <Timeseries data={d} options={options} height='xl' />;
};
