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

export const Timeseries = ({ data, options, id }) => {
	return (
		<div className='h-80'>
			<Line datasetIdKey='id' id={id} options={options} data={data} />
		</div>
	);
};
