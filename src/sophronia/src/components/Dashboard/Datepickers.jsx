import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

export const Datepickers = ({ start, end, setStart, setEnd }) => {
	return (
		<div>
			<div className='flex items-center'>
				<div className='relative py-2 p-0.5'>
					<DatePicker
						className='relative inline-flex text-center py-1.5 p-0.5 mr-2 mb-2 overflow-hidden text-sm font-medium bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:text-white text-gray-900 dark:text-white focus:ring-1 focus:outline-none border-2 border-gray-900 dark:border-white focus:border-pink-500 dark:focus:border-pink-500'
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
				<div className='relative py-2 p-0.5'>
					<DatePicker
						className='relative inline-flex text-center py-1.5 p-0.5 mr-2 mb-2 overflow-hidden text-sm font-medium bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:text-white text-gray-900 dark:text-white focus:ring-1 focus:outline-none border-2 border-gray-900 dark:border-white focus:border-pink-500 dark:focus:border-pink-500'
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
