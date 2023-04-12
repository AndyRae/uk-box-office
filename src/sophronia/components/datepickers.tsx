'use client';

import { useRouter } from 'next/navigation';
import { parseISO } from 'date-fns';

import DatePicker from 'react-datepicker';
import { useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import { parseDate } from 'lib/utils/dates';

type DatepickersProps = {
	startParam: string;
	endParam: string;
};

/**
 * Datepickers component for selecting a date range
 * @param {Object} props - Props object
 * @param {Date} props.start - Initial date
 * @param {Date} props.end - Initial end date
 * @param {Function} props.setStart - On change function to set start date
 * @param {Function} props.setEnd - On change function to set end date
 * @param {Date} props.minimum - Minimum date that can be selected
 * @returns {JSX.Element}
 */
export const Datepickers = ({
	startParam,
	endParam,
}: DatepickersProps): JSX.Element => {
	Date.prototype.addDays = function (days) {
		var date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	};

	const router = useRouter();

	const daysToShow = 90;
	const daysAllowedToGoBack = 547; // 547 days is 18 months
	const s = new Date();

	const [start, setStart] = useState(s.addDays(-daysToShow));
	const [end, setEnd] = useState(new Date());

	const handleStart = (date: any) => {
		setStart(date!);
		router.push(`?s=${parseDate(date)}&e=${parseDate(end)}`);
	};

	const handleEnd = (date: any) => {
		setEnd(date!);
		router.push(`?s=${parseDate(start)}&e=${parseDate(date)}`);
	};

	return (
		<div>
			<div className='grid grid-cols-2 gap-2 items-center'>
				<div className=''>
					<DatePicker
						className='w-full text-center py-1.5 overflow-hidden text-sm font-medium bg-white dark:bg-black rounded-lg hover:bg-gray-100 dark:hover:text-black text-gray-900 dark:text-white focus:outline-none border-2 border-gray-900 dark:border-white transition-all duration-150'
						dateFormat='dd/MM/yyyy'
						selected={parseISO(startParam)}
						onChange={(date) => handleStart(date!)}
						selectsStart
						startDate={start}
						endDate={end}
						filterDate={(d) => {
							return new Date() > d;
						}}
						minDate={s.addDays(-daysAllowedToGoBack)}
					/>
				</div>
				<div className=''>
					<DatePicker
						className='w-full text-center py-1.5 overflow-hidden text-sm font-medium bg-white dark:bg-black rounded-lg hover:bg-gray-100 dark:hover:text-black text-gray-900 dark:text-white focus:outline-none border-2 border-gray-900 dark:border-white transition-all duration-150'
						dateFormat='dd/MM/yyyy'
						selected={parseISO(endParam)}
						onChange={(date) => handleEnd(date!)}
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
