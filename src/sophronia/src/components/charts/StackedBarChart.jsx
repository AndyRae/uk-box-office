import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
	Chart as ChartJS,
	CategoryScale,
	BarElement,
	PointElement,
	LinearScale,
	Title,
	Legend,
	TimeScale,
} from 'chart.js';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElementAtEvent } from 'react-chartjs-2';

ChartJS.register(
	BarElement,
	CategoryScale,
	PointElement,
	LinearScale,
	Title,
	Legend,
	TimeScale
);

export const StackedBarChart = ({ data, labels }) => {
	const navigate = useNavigate();
	const chartRef = useRef(null);

	// Navigate to the film page when a bar is clicked
	const onClick = (event) => {
		var x = getElementAtEvent(chartRef.current, event);
		if (x.length > 0) {
			const slug = data[x[0].datasetIndex].slug;
			navigate(`/film/${slug}`);
		}
	};

	const d = {
		labels: labels,
		datasets: data,
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		hover: {
			mode: 'dataset',
		},
		interaction: {
			intersect: false,
		},
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			x: {
				type: 'time',
				distribution: 'series',
				stacked: true,
				ticks: {
					maxRotation: 0,
					minRotation: 0,
					autoSkip: true,
				},
				time: {
					unit: 'week',
					tooltipFormat: 'dd/MM/yyyy',
					displayFormats: {
						week: 'MMM dd',
						month: 'MMM yy',
						quarter: 'MMM dd',
						year: 'yyyy',
					},
				},
				grid: {
					display: false,
				},
			},
			y: {
				stacked: true,
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
				grid: {
					display: false,
					drawBorder: false,
				},
			},
		},
	};

	return (
		<BarChart
			data={d}
			options={options}
			onClick={onClick}
			chartRef={chartRef}
		/>
	);
};

const BarChart = ({ data, options, onClick, chartRef }) => {
	return (
		<div className='relative h-80'>
			<Bar
				datasetIdKey='id'
				options={options}
				data={data}
				onClick={onClick}
				ref={chartRef}
			/>
		</div>
	);
};
