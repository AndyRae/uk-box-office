'use client';

import * as React from 'react';
import clsx from 'clsx';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from 'components/ui/button-new';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	fromDate,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			fromDate={fromDate}
			toDate={new Date()}
			showOutsideDays={showOutsideDays}
			className={clsx('p-3', className)}
			classNames={{
				months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
				month: 'space-y-4',
				caption: 'flex justify-center pt-1 relative items-center',
				caption_label: 'text-sm font-medium',
				nav: 'space-x-1 flex items-center',
				nav_button_previous: 'absolute left-1',
				nav_button_next: 'absolute right-1',
				table: 'w-full border-collapse space-y-1',
				head_row: 'flex',
				head_cell:
					'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
				row: 'flex w-full mt-2',
				cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-200 [&:has([aria-selected])]:dark:bg-slate-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
				day: clsx(
					buttonVariants({ variant: 'ghost' }),
					'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
				),
				day_selected:
					'bg-bo-primary text-black hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
				day_today: 'bg-slate-200 text-black',
				day_outside: 'text-black opacity-50',
				day_disabled: 'text-muted-foreground opacity-50',
				day_range_middle:
					'aria-selected:bg-slate-200 aria-selected:dark:bg-slate-800 aria-selected:text-black aria-selected:dark:text-white',
				day_hidden: 'invisible',
				...classNames,
			}}
			{...props}
		/>
	);
}
Calendar.displayName = 'Calendar';

export { Calendar };
