import { Timeseries } from '../charts/Timeseries';
import { groupbyMonth, groupbyDate } from '../../utils/groupData';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { useState, useEffect, useRef } from 'react';
import { Tooltip } from '../ui/Tooltip';
import { useNavigate } from 'react-router-dom';
import { getElementAtEvent } from 'react-chartjs-2';

/**
 * @description Time Line Chart component as a line chart.
 * Includes chart navigation to the week pages.
 * @param {Array} data - Array of weekly box office data
 * @param {Number} height - Height of the chart
 * @param {String} color - Color of the chart
 * @param {Boolean} allowRollUp - Allow rolling up the data to monthly data.
 * @returns {JSX.Element}
 * @example
 * <TimeLineChart data={data} height={'lg'} color="#B65078" allowRollUp={true} />
 */
export const TimeLineChart = ({
	data,
	height,
	color = '#B65078',
	allowRollUp = true,
}) => {
	const navigate = useNavigate();

	const { results: weekData } = groupbyDate(data);

	console.log(weekData);

	// To configure rolling up / down the data
	const [chartData, setChartData] = useState(weekData);
	const { results } = groupbyMonth(weekData);
	const [isGroupedByMonth, setIsGroupedByMonth] = useState(false);

	useEffect(() => {
		setChartData(weekData);
	}, [data]);

	const d = {
		labels: chartData.map((d) => d.date),
		datasets: [
			{
				label: 'Box Office',
				data: chartData.map((d) => d.weekGross),
				fill: true,
				backgroundColor: [`${color}4D`],
				borderColor: [color],
				pointStyle: 'circle',
				pointRadius: 4,
				tension: 0.4,
				yAxisID: 'y',
				hoverRadius: 10,
			},
		],
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
						week: 'MMM dd',
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

	// Grouping the data by month
	const rollUp = () => {
		setChartData(results);
		setIsGroupedByMonth(true);
	};

	// Grouping the data by week (default)
	const rollDown = () => {
		setChartData(weekData);
		setIsGroupedByMonth(false);
	};

	// Navigation
	const chartRef = useRef();
	const onClick = (event) => {
		var x = getElementAtEvent(chartRef.current, event);
		if (x.length > 0) {
			const dateString = d.labels[x[0].index].split('-');
			const url = `/time/${dateString[0]}${
				dateString[1] ? '/m' + parseInt(dateString[1], 10) : ''
			}${dateString[2] ? '/d' + dateString[2] : ''}`;
			navigate(url);
		}
	};

	return (
		<>
			<div className='flex flex-row-reverse'>
				{allowRollUp ? (
					<Tooltip text={isGroupedByMonth ? 'Week' : 'Month'}>
						<AiOutlineArrowDown
							className='h-6 w-6 transition-all duration-500'
							style={!isGroupedByMonth ? { transform: 'rotate(180deg)' } : ''}
							onClick={isGroupedByMonth ? rollDown : rollUp}
						/>
					</Tooltip>
				) : (
					<div className='mt-6'></div>
				)}
			</div>
			<Timeseries
				id={'gradientid'}
				data={d}
				options={options}
				height={height}
				chartRef={chartRef}
				onClick={onClick}
			/>
		</>
	);
};
