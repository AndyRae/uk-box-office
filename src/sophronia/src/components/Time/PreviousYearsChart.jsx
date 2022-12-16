import { BarChart } from '../charts/BarChart';
import { useRef } from 'react';
import { getElementAtEvent } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

export const PreviousYearsChart = ({ data }) => {
	const navigate = useNavigate();

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		indexAxis: 'y',
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			x: {
				ticks: {
					maxRotation: 0,
					minRotation: 0,
					autoSkip: true,
				},
				grid: {
					display: false,
				},
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
			y: {
				beginAtZero: true,
				grid: {
					display: false,
					drawBorder: false,
				},
			},
		},
	};

	const d = {
		labels: data.results.map((d) => d.year),
		datasets: [
			{
				label: 'Box Office',
				data: data.results.map((d) => d.weekend_gross),
				fill: true,
				backgroundColor: ['#B65078'],
				borderColor: ['#B65078'],
				borderRadius: 4,
				hoverRadius: 10,
			},
		],
	};

	// Chart Navigation
	const chartRef = useRef();
	const onClick = (event) => {
		var x = getElementAtEvent(chartRef.current, event);
		const year = d.labels[x[0].index];
		navigate(`/time/${year}`);
	};

	return (
		<div className='my-10 h-96'>
			<BarChart
				data={d}
				options={options}
				onClick={onClick}
				chartRef={chartRef}
			/>
		</div>
	);
};
