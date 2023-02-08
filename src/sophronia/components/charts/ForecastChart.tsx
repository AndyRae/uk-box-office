'use client';

import { Timeseries } from './Timeseries';
import Forecast from 'interfaces/Forecast';

/**
 * ForecastChart
 * @param {Object} data - Data to be displayed in the chart
 * @returns {JSX.Element}
 * @example
 * <ForecastChart data={data} />
 */
export const ForecastChart = ({ data }: { data: Forecast[] }): JSX.Element => {
	const reversed = [...data].reverse();

	const d = {
		labels: reversed.map((d) => d.date),
		datasets: [
			{
				label: 'Forecast',
				data: reversed.map((d) => d.forecast_medium),
				fill: false,
				backgroundColor: ['#B65078'],
				borderColor: ['#B65078'],
				pointStyle: 'line',
				tension: 0.3,
				yAxisID: 'y',
			},
			{
				label: 'Actual',
				data: reversed.map((d) => d.week_gross),
				fill: false,
				borderColor: ['#6c81d9'],
				pointStyle: 'line',
				pointRadius: 4,
				tension: 0.3,
				yAxisID: 'y',
			},
			{
				label: 'Upper Bound',
				data: reversed.map((d) => d.forecast_high),
				fill: false,
				borderColor: ['#f197be'],
				pointStyle: 'line',
				pointRadius: 4,
				tension: 0.3,
				yAxisID: 'y',
			},
			{
				label: 'Lower Bound',
				data: reversed.map((d) => d.forecast_low),
				fill: false,
				borderColor: ['#f197be'],
				pointStyle: 'line',
				pointRadius: 4,
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
