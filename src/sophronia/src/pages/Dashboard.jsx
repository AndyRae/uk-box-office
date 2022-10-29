import { useBoxOfficeInfinite, useBoxOfficePrevious } from '../api/boxoffice';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Suspense } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { Card } from '../components/Dashboard/Card';
import {
	groupForTable,
	calculateNumberOfCinemas,
	calculateWeek1Releases,
	groupbyDate,
} from '../utils/groupData';
import { MetricChange } from '../components/charts/MetricChange';
import { Datepickers } from '../components/Dashboard/Datepickers';
import { FilmTable } from '../components/Time/FilmTable';
import { TimeLineChart } from '../components/Time/TimeLineChart';

export const DashboardPage = () => {
	Date.prototype.addDays = function (days) {
		var date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	};

	const parseDate = (input) => {
		return `${input.getFullYear()}-${input.getMonth() + 1}-${input.getDate()}`;
	};

	const s = new Date();
	const [start, setStart] = useState(s.addDays(-180));
	const [end, setEnd] = useState(new Date());

	// Parse dates to YYYY-MM-DD for the API
	const [startDate, setStartDate] = useState(parseDate(start));
	const [endDate, setEndDate] = useState(parseDate(end));

	const { results, mutate, error } = useBoxOfficeInfinite(startDate, endDate);
	const { data: timeComparisonData } = useBoxOfficePrevious(startDate, endDate);

	// Group Data
	const { tableData } = groupForTable(results);
	const { results: weekData } = groupbyDate(results);

	const boxOffice = tableData.reduce((acc, curr) => acc + curr.weekGross, 0);
	const weekendBoxOffice = tableData.reduce(
		(acc, curr) => acc + curr.weekendGross,
		0
	);
	const numberOfNewFilms = calculateWeek1Releases(results);
	const numberOfCinemas = calculateNumberOfCinemas(results);

	// Time Comparison Data
	let changeNewFilms = 0;
	let changeWeekend = 0;
	let changeWeek = 0;

	if (timeComparisonData.results.length >= 1) {
		const lastYear = timeComparisonData.results[0];

		changeNewFilms = Math.ceil(
			((numberOfNewFilms - lastYear.number_of_releases) /
				lastYear.number_of_releases) *
				100
		);
		changeWeek = Math.ceil(
			((boxOffice - lastYear.week_gross) / lastYear.week_gross) * 100
		);
		changeWeekend = Math.ceil(
			((weekendBoxOffice - lastYear.weekend_gross) / lastYear.weekend_gross) *
				100
		);
	}

	// Date Picker
	const loadData = () => {
		setStartDate(parseDate(start));
		setEndDate(parseDate(end));
	};

	return (
		<div>
			{/* Controls */}
			<div className='flex items-center'>
				<Datepickers
					start={start}
					end={end}
					setStart={setStart}
					setEnd={setEnd}
				/>
				<Button onClick={loadData}>Filter</Button>
				<Button onClick={loadData}>1W</Button>
				<Button onClick={loadData}>1M</Button>
				<Button onClick={loadData}>3M</Button>
				<Button onClick={loadData}>1Y</Button>
				Last Updated: {new Date().toLocaleString()}
			</div>

			<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Card
					title='Total Box Office'
					subtitle={`£${boxOffice.toLocaleString()}`}
				>
					{timeComparisonData && <MetricChange value={changeWeek} />}
				</Card>

				<Card
					title='Weekend Box Office'
					subtitle={`£${weekendBoxOffice.toLocaleString()}`}
				>
					{timeComparisonData && <MetricChange value={changeWeekend} />}
				</Card>

				<Card title='New Releases' subtitle={numberOfNewFilms}>
					{timeComparisonData && <MetricChange value={changeNewFilms} />}
				</Card>

				<Card title='New Releases' subtitle={numberOfNewFilms}>
					{timeComparisonData && <MetricChange value={changeNewFilms} />}
				</Card>
			</div>

			{/* Scorecards grid. */}

			{/* Charts */}

			<div className='grid md:grid-cols-2 lg:grid-cols-2 gap-4'>
				<div>{weekData && <TimeLineChart data={weekData.reverse()} />}</div>
				<div>{weekData && <TimeLineChart data={weekData.reverse()} />}</div>
			</div>

			{/* Table */}
			<div className='mt-4'>
				<Suspense fallback={<Spinner />}>
					<FilmTable data={tableData} />
				</Suspense>
			</div>
		</div>
	);
};

export const Dashboard = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<DashboardPage />
		</Suspense>
	);
};
