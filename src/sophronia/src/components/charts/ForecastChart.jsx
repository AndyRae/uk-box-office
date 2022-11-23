import { Timeseries } from './Timeseries';

export const ForecastChart = ({ data }) => {
	const reversed = [...data].reverse();

	const d = {
		labels: reversed.map((d) => d.date),
		datasets: [
			{
				label: 'Actual',
				data: reversed.map((d) => d.week_gross),
				fill: false,
				borderColor: ['#50b68e4d'],
				pointStyle: 'line',
				pointRadius: 4,
				tension: 0.3,
				yAxisID: 'y',
			},
			{
				label: 'Upper Bound',
				data: reversed.map((d) => d.forecast_high),
				fill: false,
				borderColor: ['#f4777f33'],
				pointStyle: 'line',
				pointRadius: 4,
				tension: 0.3,
				yAxisID: 'y',
			},
			{
				label: 'Forecast',
				data: reversed.map((d) => d.forecast_medium),
				fill: false,
				backgroundColor: ['#B650784D'],
				borderColor: ['#B65078'],
				pointStyle: 'line',
				tension: 0.3,
				yAxisID: 'y',
			},
			{
				label: 'Lower Bound',
				data: reversed.map((d) => d.forecast_low),
				fill: false,
				borderColor: ['#f4777f33'],
				pointStyle: 'line',
				pointRadius: 4,
				tension: 0.3,
				yAxisID: 'y',
			},
		],
	};
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				type: 'time',
				distribution: 'series',
				ticks: {
					maxRotation: 0,
					minRotation: 0,
					autoSkip: true,
				},
				time: {
					unit: 'week',
					tooltipFormat: 'dd/MM/yyyy',
				},
				grid: {
					display: false,
				},
				offset: false,
			},
			y: {
				beginAtZero: true,
				min: 0,
				offset: false,
				ticks: {
					autoSkip: true,
					stepSize: 10000000,
					callback: function (value, index, values) {
						var ranges = [
							{ divider: 1e6, suffix: 'M' },
							{ divider: 1e3, suffix: 'k' },
						];
						function formatNumber(n) {
							for (var i = 0; i < ranges.length; i++) {
								if (n >= ranges[i].divider) {
									return (n / ranges[i].divider).toString() + ranges[i].suffix;
								}
							}
							return n;
						}
						return '£' + formatNumber(value);
					},
				},
			},
		},
	};

	return <Timeseries options={options} data={d} />;
};
