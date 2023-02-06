import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	BarElement,
	PointElement,
	LinearScale,
	LineElement,
	Title,
	Legend,
} from 'chart.js';

ChartJS.register(
	BarElement,
	CategoryScale,
	PointElement,
	LinearScale,
	LineElement,
	Title,
	Legend
);

type BarChartProps = {
	data: any;
	options: object;
	onClick: () => void;
	chartRef: any;
};

/**
 * Base BarChart component
 * @param {Object} data - Data to be displayed in the chart
 * @param {Object} options - Options for the chart
 * @param {Function} onClick - Function to be called when a bar is clicked
 * @param {Object} chartRef - Reference to the chart
 * @returns {JSX.Element}
 */
export const BarChart = ({
	data,
	options,
	onClick,
	chartRef,
}: BarChartProps): JSX.Element => {
	return (
		<div className='my-10 h-96'>
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
