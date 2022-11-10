import { Timeseries } from '../charts/Timeseries';

export const FilmTimeChart = ({ data }) => {
	const d = {
		labels: data.map((d) => d.date),
		datasets: [
			{
				label: 'Weekly Box Office',
				data: data.map((d) => d.week_gross),
				fill: true,
				backgroundColor: ['#f871714D'],
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
				offset: false,
			},
			y: {
				beginAtZero: true,
				min: 0,
				grid: {
					display: false,
				},
				position: 'left',
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
