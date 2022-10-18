import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LineElement,
	PointElement,
	LinearScale,
	Title,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, PointElement, LinearScale, Title);

export const Timeseries = ({ data, options }) => {
	return (
		<div className='my-10 h-80'>
			<Line datasetIdKey='id' options={options} data={data} />
		</div>
	);
};
