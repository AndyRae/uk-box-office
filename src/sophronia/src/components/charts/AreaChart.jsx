import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	Filler,
	LineElement,
	PointElement,
	LinearScale,
	Title,
} from 'chart.js';

ChartJS.register(
	LineElement,
	CategoryScale,
	Filler,
	PointElement,
	LinearScale,
	Title
);

export const AreaChart = ({ data, options, id }) => {
	return (
		<div className='my-10 h-80'>
			<Line datasetIdKey='id' id={id} options={options} data={data} />
		</div>
	);
};
