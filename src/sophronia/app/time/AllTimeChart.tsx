'use client';

import { MouseEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getElementAtEvent } from 'react-chartjs-2';
import { BarChart } from 'components/charts/BarChart';

import Time from 'interfaces/Time';

/**
 * @description All Time Chart component as a bar chart.
 * Includes chart navigation to the year pages.
 * @param {Array} data - Array of annual box office data
 * @returns {JSX.Element}
 * @example
 * <AllTimeChart data={data} />
 */
export const AllTimeChart = ({ data }: { data: Time[] }): JSX.Element => {
	const router = useRouter();

	const d = {
		labels: data.map((d: { year: string }) => d.year),
		datasets: [
			{
				label: 'Admissions',
				data: data.map((d: { admissions: number }) => d.admissions),
				fill: false,
				backgroundColor: ['#52A5ED4D'],
				borderColor: ['#52A5ED'],
				pointStyle: 'point',
				pointRadius: 4,
				borderRadius: 4,
				hoverRadius: 10,
				tension: 0.3,
				yAxisID: 'y1',
				type: 'line',
			},
			{
				label: 'Box Office',
				data: data.map((d: { week_gross: number }) => d.week_gross),
				fill: false,
				backgroundColor: ['#B65078'],
				borderColor: ['#B65078'],
				pointStyle: 'line',
				pointRadius: 4,
				borderRadius: 4,
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
				position: 'left',
				ticks: {
					autoSkip: true,
					stepSize: 200000000,
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
			y1: {
				beginAtZero: true,
				position: 'right',
				ticks: {
					autoSkip: true,
					stepSize: 200000000,
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
						return '' + formatNumber(value);
					},
				},
				grid: {
					display: false,
					drawBorder: false,
				},
			},
		},
	};

	// Chart Navigation on bar click to year page
	const chartRef = useRef();
	const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
		console.log('welp');
		var x = getElementAtEvent(chartRef.current, event);
		const year = d.labels[x[0].index];
		router.push(`/time/${year}`);
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
