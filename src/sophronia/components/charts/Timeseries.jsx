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

/**
 * Base Timeseries component
 * @param {Object} data - Data to be displayed in the chart
 * @param {Object} options - Options for the chart
 * @param {String} id - ID of the chart
 * @param {String} height - Height of the chart
 * @param {Object} chartRef - Reference to the chart
 * @param {Function} onClick - Function to be called when a bar is clicked
 * @returns {JSX.Element}
 */
export const Timeseries = ({
	data,
	options,
	id,
	height = 'lg',
	chartRef,
	onClick,
}) => {
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