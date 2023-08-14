'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { Button } from './ui/button';
import { parseDate } from '@/lib/helpers/dates';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

import { parseISO } from 'date-fns';
import addDays from 'date-fns/addDays';
import { CalendarDateRangePicker } from './date-range-picker';

interface ControlsProps extends HTMLAttributes<HTMLDivElement> {
	start: string;
	end: string;
}

/**
 *
 */
export const Controls = forwardRef<HTMLDivElement, ControlsProps>(
	({ start, end, children }) => {
		const router = useRouter();
		const pathname = usePathname();

		// Pushes new date to URL
		const changeDate = async (days: number) => {
			const today = new Date();
			router.push(
				`${pathname}?s=${parseDate(addDays(today, -days))}&e=${parseDate(
					today
				)}`
			);
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
					className=''
				>
					1W
				</Button>
				<Button
					variant={'outline'}
					onClick={() => changeDate(30)}
					disabled={diffDays === 30}
					className=''
				>
					1M
				</Button>
				<Button
					variant={'outline'}
					onClick={() => changeDate(90)}
					disabled={diffDays === 90}
					className=''
				>
					3M
				</Button>
				<Button
					variant={'outline'}
					onClick={() => changeDate(180)}
					disabled={diffDays === 180}
					className=''
				>
					6M
				</Button>
				<Button
					variant={'outline'}
					onClick={() => changeDate(365)}
					disabled={diffDays === 365}
					className=''
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
