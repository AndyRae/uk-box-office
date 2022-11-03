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
} from 'chart.js';

ChartJS.register(
	LineElement,
	CategoryScale,
	Filler,
	PointElement,
	LinearScale,
	Title,
	TimeScale
);

export const Timeseries = ({ data, options, id }) => {
	return (
		<div className='my-10 h-80'>
			<Line datasetIdKey='id' id={id} options={options} data={data} />
		</div>
	);
};
