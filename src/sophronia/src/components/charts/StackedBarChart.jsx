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
import { Tooltip } from '../ui/Tooltip';
import { AiOutlineArrowDown } from 'react-icons/ai';

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
	const chartRef = useRef(null);
	const onClick = (e) => {
		const { active } = chartRef.current.chartInstance;
		if (active.length) {
			const { _index } = active[0];
			console.log(_index);
		}
	};

	const d = {
		labels: labels,
		datasets: data,
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
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
						week: 'dd MMM',
						month: 'MMM yy',
						quarter: 'MMM dd',
						year: 'yyyy',
					},
				},
				grid: {
					display: false,
				},
				// offset: false,
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
