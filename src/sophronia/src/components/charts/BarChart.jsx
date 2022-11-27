import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	BarElement,
	PointElement,
	LinearScale,
	Title,
	Legend,
} from 'chart.js';

ChartJS.register(
	BarElement,
	CategoryScale,
	PointElement,
	LinearScale,
	Title,
	Legend
);

export const BarChart = ({ data, options, onClick, chartRef }) => {
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
