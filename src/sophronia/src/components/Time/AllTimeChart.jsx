import { BarChart } from '../charts/BarChart';

export const AllTimeChart = ({ data }) => {
	const d = {
		labels: data.reverse().map((d) => d.year),
		datasets: [
			{
				label: 'Box Office',
				data: data.reverse().map((d) => d.week_gross),
				fill: false,
				backgroundColor: ['#f87171'],
				borderColor: ['#f87171'],
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
					stepSize: 200000000,
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
			<BarChart data={d} options={options} />
		</>
	);
};
