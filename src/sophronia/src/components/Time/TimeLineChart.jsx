import { Timeseries } from '../charts/Timeseries';

export const TimeLineChart = ({ data }) => {
	const d = {
		labels: data.map((d) => d.date),
		datasets: [
			{
				label: 'Box Office',
				data: data.map((d) => d.weekGross),
				fill: false,
				backgroundColor: ['#FE7E6D'],
				borderColor: ['#FE7E6D'],
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
				offset: true,
			},
			y: {
				beginAtZero: true,
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
		<>
			<Timeseries id={'gradientid'} data={d} options={options} />
		</>
	);
};
