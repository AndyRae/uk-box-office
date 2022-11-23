import { Timeseries } from '../charts/Timeseries';

export const TimeLineChart = ({ data, height }) => {
	const d = {
		labels: data.map((d) => d.date),
		datasets: [
			{
				label: 'Box Office',
				data: data.map((d) => d.weekGross),
				fill: true,
				backgroundColor: ['#B650784D'],
				borderColor: ['#B65078'],
				pointStyle: 'line',
				pointRadius: 4,
				tension: 0.4,
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
					displayFormats: {
						week: 'dd MMM',
						month: 'MMM yy',
						quarter: 'MMM dd',
						year: 'yyyy',
					},
				},
				grid: {
					display: false,
				},
				offset: false,
			},
			y: {
				beginAtZero: true,
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

	if (d.labels.length > 6) {
		options.scales.x.time.unit = 'month';
	}

	return (
		<Timeseries id={'gradientid'} data={d} options={options} height={height} />
	);
};
