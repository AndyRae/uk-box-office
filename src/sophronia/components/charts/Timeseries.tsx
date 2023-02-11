'use client';

import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
	Chart as ChartJS,
	CategoryScale,
	Filler,
	LineElement,
	PointElement,
	LinearScale,
	Title,
	TimeScale,
	Tooltip,
} from 'chart.js';

ChartJS.register(
	LineElement,
	CategoryScale,
	Filler,
	PointElement,
	LinearScale,
	Title,
	TimeScale,
	Tooltip
);

type TimeseriesProps = {
	data: { datasets: any[]; labels: string[] };
	options: object;
	id?: string;
	height?: 'sm' | 'md' | 'lg' | 'xl';
	chartRef?: any;
	onClick?: (arg0?: any) => void;
};

/**
 * Base Timeseries component
 * @param {Object} props - Props object
 * @param {Object} props.data - Data to be displayed in the chart
 * @param {Object} props.options - Options for the chart
 * @param {String} props.id - ID of the chart
 * @param {String} props.height - Height of the chart
 * @param {Object} props.chartRef - Reference to the chart
 * @param {Function} props.onClick - Function to be called when a bar is clicked
 * @returns {JSX.Element}
 */
export const Timeseries = ({
	data,
	options,
	id,
	height = 'lg',
	chartRef,
	onClick,
}: TimeseriesProps): JSX.Element => {
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
			size = 'h-[34rem]';
		default:
			break;
	}

	return (
		<div className={`relative ${size}`}>
			<Line
				datasetIdKey='id'
				id={id}
				options={options}
				data={data}
				ref={chartRef}
				onClick={onClick}
			/>
		</div>
	);
};
