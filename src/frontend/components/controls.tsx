'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { parseISO } from 'date-fns';
import addDays from 'date-fns/addDays';

import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { parseDate } from '@/lib/helpers/dates';

interface ControlsProps extends HTMLAttributes<HTMLDivElement> {
	start: string;
	end: string;
}

/**
 * Control buttons for the dashboard.
 */
export const DashboardControls = forwardRef<HTMLDivElement, ControlsProps>(
	({ start, end, children }) => {
		const router = useRouter();
		const pathName = usePathname();
		const searchParams = useSearchParams();
		const queryParams = new URLSearchParams(searchParams);

		// Pushes new date to URL
		const changeDate = async (days: number) => {
			const today = new Date();
			queryParams.set('s', parseDate(addDays(today, -days)));
			queryParams.set('e', parseDate(today));

			const url = `${pathName}?${queryParams.toString()}`;
			router.push(url);
		};

		// Work out the difference between the last two dates
		// Used to set the active button
		const sDate = parseISO(start);
		const eDate = parseISO(end);
		const diffTime = Math.abs(eDate.getTime() - sDate.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		return (
			<ControlsWrapper>
				<CalendarDateRangePicker startParam={sDate} endParam={eDate} />

				<Button
					variant={'outline'}
					onClick={() => changeDate(7)}
					disabled={diffDays === 7}
					className='rounded-r-none sm:ml-4'
				>
					1W
				</Button>
				<Button
					variant={'outline'}
					onClick={() => changeDate(30)}
					disabled={diffDays === 30}
					className='rounded-none'
				>
					1M
				</Button>
				<Button
					variant={'outline'}
					onClick={() => changeDate(90)}
					disabled={diffDays === 90}
					className='rounded-none'
				>
					3M
				</Button>
				<Button
					variant={'outline'}
					onClick={() => changeDate(180)}
					disabled={diffDays === 180}
					className='rounded-none'
				>
					6M
				</Button>
				<Button
					variant={'outline'}
					onClick={() => changeDate(365)}
					disabled={diffDays === 365}
					className='rounded-l-none'
				>
					1Y
				</Button>
				{children}
			</ControlsWrapper>
		);
	}
);

interface ControlsWrapperProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Wrapper for controls.
 */
const ControlsWrapper = forwardRef<HTMLDivElement, ControlsWrapperProps>(
	({ children }) => {
		return (
			<div className='flex flex-wrap mb-2 gap-y-4 items-center justify-center'>
				{children}
			</div>
		);
	}
);
