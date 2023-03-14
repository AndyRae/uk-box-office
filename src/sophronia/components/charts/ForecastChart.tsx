'use client';

import { Timeseries } from './Timeseries';
import { Topline } from 'interfaces/BoxOffice';

/**
 * ForecastChart
 * @param {Object} data - Data to be displayed in the chart
 * @returns {JSX.Element}
 * @example
 * <ForecastChart data={data} />
 */
export const ForecastChart = ({ data }: { data: Topline[] }): JSX.Element => {
	const reversed = [...data].reverse();

	const d = {
		labels: reversed.map((d) => d.date),
		datasets: [
			{
				label: 'Forecast',
				data: reversed.map((d) => d.forecast_medium),
				fill: false,
				backgroundColor: ['#10b981'],
				borderColor: ['#10b981'],
				pointStyle: 'line',
				borderWidth: 1,
				yAxisID: 'y',
			},
			{
				label: 'Actual',
				data: reversed.map((d) => d.week_gross),
				fill: false,
				borderColor: ['#6c81d9'],
				pointStyle: 'line',
				pointRadius: 4,
				borderWidth: 1,
				yAxisID: 'y',
			},
			{
				label: 'Upper Bound',
				data: reversed.map((d) => d.forecast_high),
				fill: false,
				borderColor: ['#f197be'],
				pointStyle: 'line',
				pointRadius: 4,
				borderWidth: 1,
				yAxisID: 'y',
			},
		],
	};
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			intersect: false,
		},
		plugins: {
			legend: {
				labels: {
					usePointStyle: true,
				},
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
					unit: 'month',
					tooltipFormat: 'dd/MM/yyyy',
					displayFormats: {
						week: 'dd MMM',
						month: 'MMMM yyyy',
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
				min: 0,
				offset: false,
				ticks: {
					autoSkip: true,
					stepSize: 10000000,
					callback: function (value: number, index: number, values: number[]) {
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

	return <Timeseries options={options} data={d} height='xl' />;
};
