import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

type DatepickersProps = {
	start: Date;
	end: Date;
	setStart: (date: Date) => void;
	setEnd: (date: Date) => void;
	minimum: Date;
};

/**
 * Datepickers component for selecting a date range
 * @param {Object} start - Initial date
 * @param {Object} end - Initial end date
 * @param {Function} setStart - On change function to set start date
 * @param {Function} setEnd - On change function to set end date
 * @param {Object} minimum - Minimum date that can be selected
 * @returns {JSX.Element}
 */
export const Datepickers = ({
	start,
	end,
	setStart,
	setEnd,
	minimum,
}: DatepickersProps): JSX.Element => {
	return (
		<div>
			<div className='grid grid-cols-2 gap-2 items-center'>
				<div className=''>
					<DatePicker
						className='w-full text-center py-1.5 overflow-hidden text-sm font-medium bg-white dark:bg-black rounded-lg hover:bg-gray-100 dark:hover:text-black text-gray-900 dark:text-white focus:outline-none border-2 border-gray-900 dark:border-white transition-all duration-150'
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
						className='w-full text-center py-1.5 overflow-hidden text-sm font-medium bg-white dark:bg-black rounded-lg hover:bg-gray-100 dark:hover:text-black text-gray-900 dark:text-white focus:outline-none border-2 border-gray-900 dark:border-white transition-all duration-150'
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
