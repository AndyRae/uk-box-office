import { Timeseries } from '../charts/Timeseries';
import { useNavigate } from 'react-router-dom';
import { getDatasetAtEvent } from 'react-chartjs-2';
import { useRef } from 'react';

export const MultipleFilmsChart = ({ data, labels, height }) => {
	const navigate = useNavigate();

	const d = {
		labels: labels,
		datasets: data,
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
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
				grid: {
					display: false,
					drawBorder: false,
				},
			},
		},
	};

	if (d.labels.length > 6) {
		options.scales.x.time.unit = 'month';
	}

	// Navigation
	const chartRef = useRef();
	const onClick = (event) => {
		var x = getDatasetAtEvent(chartRef.current, event);
		if (x.length > 0) {
			const slug = data[x[0].datasetIndex].slug;
			navigate(`/film/${slug}`);
		}
	};

	return (
		<Timeseries
			id={'gradientid'}
			data={d}
			options={options}
			height={height}
			chartRef={chartRef}
			onClick={onClick}
		/>
	);
};
