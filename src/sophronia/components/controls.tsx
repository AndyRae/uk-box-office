'use client';

import { ButtonGroup } from './ui/button-group';
import { Button } from './ui/button';
import { LastUpdated } from './last-updated';
import { DatasourceCard } from './datasource';
import { parseDate } from 'lib/utils/dates';

import { parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import addDays from 'date-fns/addDays';
import { CalendarDateRangePicker } from './date-range-picker';

export const Controls = ({
	start,
	end,
	lastUpdated,
}: {
	start: string;
	end: string;
	lastUpdated: string;
}) => {
	const router = useRouter();

	// Pushes new date to URL
	const changeDate = async (days: number) => {
		const today = new Date();
		router.push(`?s=${parseDate(addDays(today, -days))}&e=${parseDate(today)}`);
	};

	// Work out the difference between the last two dates
	// Used to set the active button
	const sDate = parseISO(start);
	const eDate = parseISO(end);
	const diffTime = Math.abs(eDate.getTime() - sDate.getTime());
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	return (
		<div className='flex flex-wrap mb-2 gap-y-4 items-center justify-center'>
			<CalendarDateRangePicker startParam={sDate} endParam={eDate} />

			<ButtonGroup>
				<Button
					onClick={() => changeDate(7)}
					isActive={diffDays === 7}
					aria='1 Week'
				>
					1W
				</Button>
				<Button
					onClick={() => changeDate(30)}
					isActive={diffDays === 30}
					aria='1 Month'
				>
					1M
				</Button>
				<Button
					onClick={() => changeDate(90)}
					isActive={diffDays === 90}
					aria='3 Months'
				>
					3M
				</Button>
				<Button
					onClick={() => changeDate(365)}
					isActive={diffDays === 365}
					aria='1 Year'
				>
					1Y
				</Button>
			</ButtonGroup>

			<LastUpdated date={lastUpdated} />

			<DatasourceCard />
		</div>
	);
};
