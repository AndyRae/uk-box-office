'use client';

import { Timeseries } from 'components/charts/Timeseries';
import { FilmWithWeeks } from 'interfaces/Film';

type TimeLineChartProps = {
	data: FilmWithWeeks[];
	height?: 'sm' | 'md' | 'lg' | 'xl';
	color?: string;
};

/**
 * @description Time Line Chart component as a line chart.
 * Includes chart navigation to the week pages.
 * @param {Object} props - Props object
 * @param {Array} props.data - Array of weekly box office data
 * @param {String} props.height - Height of the chart
 * @param {String} props.color - Color of the chart
 * @param {Boolean} props.allowRollUp - Allow rolling up the data to monthly data.
 * @returns {JSX.Element}
 * @example
 * <TimeLineChart data={data} height={'lg'} color="#B65078" allowRollUp={true} />
 */
export const CompareCumulativeChart = ({
	data,
	height,
}: TimeLineChartProps): JSX.Element => {
	var labelsNumber = Math.max.apply(
		Math,
		data.map(function (o) {
			return o.weeks.length;
		})
	);

	const d = {
		labels: [...Array(labelsNumber).keys()].slice(1),
		datasets: data.map((film) => {
			return {
				label: film.name,
				data: film.weeks.map((d) => d.total_gross),
				fill: false,
				borderColor: film.color,
				backgroundColor: film.color,
				pointStyle: 'circle',
				pointRadius: 4,
				borderWidth: 1,
				tension: 0.1,
				yAxisID: 'y',
				hoverRadius: 10,
			};
		}),
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
		},
		interaction: {
			mode: 'index',
			intersect: false,
		},
		scales: {
			x: {
				distribution: 'series',
				title: {
					display: true,
					text: 'Week',
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
				offset: false,
				ticks: {
					autoSkip: true,
					stepSize: 10000000,
					callback: function (value: any, index: number, values: any) {
						var ranges = [
							{ divider: 1e6, suffix: 'M' },
							{ divider: 1e3, suffix: 'k' },
						];
						function formatNumber(n: number) {
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
		<Timeseries id={'gradientid'} data={d} options={options} height={height} />
	);
};
