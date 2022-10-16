import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

export const Datepickers = ({ start, end, setStart, setEnd }) => {
	return (
		<div>
			<div className='flex items-center'>
				<div className='relative px-4 py-2 text-black'>
					<DatePicker
						dateFormat='dd/MM/yyyy'
						selected={start}
						onChange={(date) => setStart(date)}
						selectsStart
						startDate={start}
						endDate={end}
						filterDate={(d) => {
							return new Date() > d;
						}}
					/>
				</div>
				<span className='mx-4 text-gray-500'>to</span>
				<div className='relative px-4 py-2 text-black '>
					<DatePicker
						dateFormat='dd/MM/yyyy'
						selected={end}
						onChange={(date) => setEnd(date)}
						selectsEnd
						startDate={start}
						endDate={end}
						minDate={start}
						filterDate={(d) => {
							return new Date() > d;
						}}
					/>
				</div>
			</div>
		</div>
	);
};
