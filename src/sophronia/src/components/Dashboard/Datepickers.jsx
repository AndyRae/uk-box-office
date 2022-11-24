import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

export const Datepickers = ({ start, end, setStart, setEnd, minimum }) => {
	return (
		<div>
			<div className='grid grid-cols-2 gap-2 items-center'>
				<div className=''>
					<DatePicker
						className='w-full text-center py-1.5 overflow-hidden text-sm font-medium bg-white dark:bg-black rounded-lg hover:bg-gray-100 dark:hover:text-white text-gray-900 dark:text-white focus:outline-none border-2 border-gray-900 dark:border-white'
						dateFormat='dd/MM/yyyy'
						selected={start}
						onChange={(date) => setStart(date)}
						selectsStart
						startDate={start}
						endDate={end}
						filterDate={(d) => {
							return new Date() > d;
						}}
						minDate={minimum}
					/>
				</div>
				<div className=''>
					<DatePicker
						className='w-full text-center py-1.5 overflow-hidden text-sm font-medium bg-white dark:bg-black rounded-lg hover:bg-gray-100 dark:hover:text-white text-gray-900 dark:text-white focus:outline-none border-2 border-gray-900 dark:border-white'
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
