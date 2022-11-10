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
				borderColor: ['#FE7E6D33'],
				pointStyle: 'circle',
				tension: 0.3,
				yAxisID: 'y',
			},
			{
				label: 'Upper Bound',
				data: reversed.map((d) => d.forecast_high),
				fill: false,
				borderColor: ['#17439b33'],
				pointStyle: 'circle',
				tension: 0.3,
				yAxisID: 'y',
			},
			{
				label: 'Forecast',
				data: reversed.map((d) => d.forecast_medium),
				fill: false,
				backgroundColor: ['#f871714D'],
				borderColor: ['#f87171'],
				pointStyle: 'circle',
				tension: 0.3,
				yAxisID: 'y',
			},
			{
				label: 'Lower Bound',
				data: reversed.map((d) => d.forecast_low),
				fill: false,
				borderColor: ['#17439b33'],
				pointStyle: 'circle',
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

	return (
		<div className='my-10 h-96'>
			<Timeseries options={options} data={d} />
		</div>
	);
};
