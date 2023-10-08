'use client';

import * as React from 'react';
import { format, addDays } from 'date-fns';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { DateRange } from 'react-day-picker';
import clsx from 'clsx';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '@/components/icons';
import { parseDate } from '@/lib/helpers/dates';

interface CalendarDateRangePickerProps
	extends React.HTMLAttributes<HTMLDivElement> {
	startParam: Date;
	endParam: Date;
}

export function CalendarDateRangePicker({
	startParam,
	endParam,
	className,
}: CalendarDateRangePickerProps) {
	const router = useRouter();
	const pathName = usePathname();
	const searchParams = useSearchParams();
	const queryParams = new URLSearchParams(searchParams);

	const minDays = 547; // 547 days is 18 months
	const fromDate = addDays(new Date(), -minDays);

	const [date, setDate] = React.useState<DateRange | undefined>({
		from: startParam,
		to: endParam,
	});

	const handleSelect = (date: any) => {
		setDate(date);

		queryParams.set('s', parseDate(date.from));
		queryParams.set('e', parseDate(date.to));

		const url = `${pathName}?${queryParams.toString()}`;
		router.push(url);
	};

	const CalendarIcon = Icons['calendar'];

	// Update date state when startParam or endParam change
	if (startParam !== date?.from || endParam !== date?.to) {
		setDate({ from: startParam, to: endParam });
	}

	return (
		<div className={clsx('grid gap-2', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id='date'
						variant={'outline'}
						className={clsx(
							'w-[300px] justify-start text-left font-normal',
							!date && 'text-muted-foreground'
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'LLL dd, y')} -{' '}
									{format(date.to, 'LLL dd, y')}
								</>
							) : (
								format(date.from, 'LLL dd, y')
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={date?.from}
						selected={date}
						onSelect={(date) => handleSelect(date!)}
						numberOfMonths={2}
						fromDate={fromDate}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
