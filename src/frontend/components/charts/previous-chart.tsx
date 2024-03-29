'use client';

import { BarChart } from '@/components/charts/bar';
import { MouseEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getElementAtEvent } from 'react-chartjs-2';

/**
 * @description Charts previous box office years as a horizontal bar chart.
 * Includes chart navigation to the year pages.
 * @param {Object} props - Props object
 * @param {Object} props.data - Array of annual box office data
 * @returns {JSX.Element}
 * @example
 * <PreviousYearsChart data={data} />
 */
export const PreviousChart = ({ data }: { data: any[] }): JSX.Element => {
	const router = useRouter();

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
				grid: {
					display: false,
				},
				ticks: {
					maxRotation: 0,
					minRotation: 0,
					autoSkip: true,
					stepSize: 10000000,
					callback: function (value: number, index: number, values: any) {
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
		labels: data.map((d: { year: string }) => d.year),
		datasets: [
			{
				label: 'Box Office',
				data: data.map((d: { total: number }) => d.total),
				fill: true,
				backgroundColor: ['#10b981'],
				borderColor: ['#10b981'],
				borderRadius: 4,
				hoverRadius: 10,
			},
		],
	};

	// Chart Navigation
	const chartRef = useRef();
	const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
		var x = getElementAtEvent(chartRef.current as any, event);
		const year = d.labels[x[0].index];
		router.push(`/time/${year}`);
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
