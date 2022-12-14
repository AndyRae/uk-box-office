import { Timeseries } from '../charts/Timeseries';

/**
 * @description Market Share Chart component
 * @param {Array} uniqueYears - Array of unique years
 * @param {Array} graphData - Array of graph data
 * @returns {JSX.Element}
 * @example
 * <MarketShareChart uniqueYears={uniqueYears} graphData={graphData} />
 */
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
