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
import { groupStackedFilms } from '../../utils/groupData';

ChartJS.register(
	BarElement,
	CategoryScale,
	PointElement,
	LinearScale,
	Title,
	Legend,
	TimeScale
);

/**
 * Dashboard StackedBarChart component
 * @param {Object} data - Data to be displayed in the chart
 * @param {Number} height - Height of the chart
 * @returns {JSX.Element}
 * @example
 * <StackedBarChart data={data} height={height} />
 */
export const StackedBarChart = ({ data, height }) => {
	const navigate = useNavigate();
	const chartRef = useRef(null);

	// Prepare the data for the chart
	const { stackedData } = groupStackedFilms(data);
	const labels = [...new Set(data.map((d) => d.date))];

	// Only stack the bars if there's more than one date.
	const isStacked = labels?.length > 1;

	// Navigate to the film page when a bar is clicked
	// Disabled for now as it's not a good UX
	const onClick = (event) => {
		// var x = getElementAtEvent(chartRef.current, event);
		// if (x.length > 0) {
		// 	const slug = data[x[0].datasetIndex].slug;
		// 	navigate(`/film/${slug}`);
		// }
	};

	const d = {
		labels: labels,
		datasets: stackedData,
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
				stacked: isStacked,
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
				stacked: isStacked,
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

	if (d?.labels?.length > 6) {
		options.scales.x.time.unit = 'month';
	}

	return (
		<BarChart
			data={d}
			options={options}
			onClick={onClick}
			chartRef={chartRef}
			height={height}
		/>
	);
};

const BarChart = ({ data, options, onClick, chartRef, height = 'lg' }) => {
	var size = 'h-96';
	switch (height) {
		case 'sm':
			size = 'h-60';
			break;
		case 'md':
			size = 'h-80';
			break;
		case 'lg':
			size = 'h-96';
			break;
		case 'xl':
			size = 'h-screen';
		default:
			break;
	}

	return (
		<div className={`relative ${size}`}>
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
