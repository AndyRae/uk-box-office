import { Timeseries } from '../charts/Timeseries';

export const FilmCumulativeChart = ({ data }) => {
	const d = {
		labels: data.map((d) => d.date),
		datasets: [
			{
				label: 'Cumulative Box Office',
				data: data.map((d) => d.total_gross),
				fill: true,
				backgroundColor: ['#1E3A8A4D'],
				borderColor: ['#1E3A8A'],
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
				time: {
					unit: 'week',
					tooltipFormat: 'dd/MM/yyyy',
					displayFormats: {
						week: 'dd MMM',
						month: 'MMM yy',
						quarter: 'MMM dd',
						year: 'yyyy',
					},
				},
				ticks: {
					maxRotation: 0,
					minRotation: 0,
					autoSkip: true,
				},
				grid: {
					display: false,
				},
				offset: false,
			},
			y: {
				beginAtZero: true,
				min: 0,
				grid: {
					display: false,
				},
				position: 'right',
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
				grid: {
					display: false,
					drawBorder: false,
				},
			},
		},
		plugins: {
			legend: {
				display: true,
			},
		},
	};
	return (
		<div className='my-10 h-80'>
			<Timeseries options={options} data={d} />
		</div>
	);
};
