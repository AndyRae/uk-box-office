import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useBoxOfficeInfinite, useBoxOfficePrevious } from '../api/boxoffice';
import { Button } from '../components/ui/Button';
import { ButtonGroup } from '../components/ui/ButtonGroup';
import { Spinner } from '../components/ui/Spinner';
import { Card } from '../components/Dashboard/Card';
import {
	groupForTable,
	calculateNumberOfCinemas,
	calculateWeek1Releases,
	groupbyDate,
	groupForAreaChart,
} from '../utils/groupData';
import { MetricChange } from '../components/charts/MetricChange';
import { Datepickers } from '../components/Dashboard/Datepickers';
import { FilmTable } from '../components/Time/FilmTable';
import { TimeLineChart } from '../components/Time/TimeLineChart';
import { Tooltip } from '../components/ui/Tooltip';
import {
	Skeleton,
	SkeletonCards,
	SkeletonCharts,
	SkeletonTable,
} from '../components/Dashboard/Skeleton';
import { MultipleFilmsChart } from '../components/Dashboard/MultipleFilmsChart';
import { StructuredTimeData } from '../components/StructuredData';

export const DashboardPage = () => {
	Date.prototype.addDays = function (days) {
		var date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	};

	const parseDate = (input) => {
		return `${input.getFullYear()}-${input.getMonth() + 1}-${input.getDate()}`;
	};

	const daysToShow = 90;
	const s = new Date();
	const [start, setStart] = useState(s.addDays(-daysToShow));
	const [end, setEnd] = useState(new Date());

	// Parse dates to YYYY-MM-DD for the API
	const [startDate, setStartDate] = useState(parseDate(start));
	const [endDate, setEndDate] = useState(parseDate(end));

	useEffect(() => {
		setStartDate(parseDate(start));
		setEndDate(parseDate(end));
	}, [start, end]);

	const { results, mutate, error, isReachedEnd } = useBoxOfficeInfinite(
		startDate,
		endDate
	);
	const { data: timeComparisonData } = useBoxOfficePrevious(startDate, endDate);

	// Group Data
	const { tableData } = groupForTable(results);
	const { areaData } = groupForAreaChart(results);
	const { results: weekData } = groupbyDate(results);

	const uniqueDates = [...new Set(results.map((d) => d.date))];

	const boxOffice = tableData.reduce((acc, curr) => acc + curr.weekGross, 0);
	const weekendBoxOffice = tableData.reduce(
		(acc, curr) => acc + curr.weekendGross,
		0
	);
	const numberOfNewFilms = calculateWeek1Releases(results);
	const numberOfCinemas = calculateNumberOfCinemas(results);
	const lastUpdated = results[0]?.date;

	// Time Comparison Data
	let changeNewFilms = 0;
	let changeWeekend = 0;
	let changeWeek = 0;
	let changeCinemas = 0;

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
		changeCinemas = Math.ceil(
			((numberOfCinemas - lastYear.number_of_cinemas) /
				lastYear.number_of_cinemas) *
				100
		);
	}

	// Buttons for the date picker
	const changeDate = async (days) => {
		const today = new Date();
		setStart(today.addDays(-days));
	};

	// Work out the difference between the last two dates
	const diffTime = Math.abs(s - start);
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	console.log(diffDays);

	return (
		<div className='transition ease-in-out'>
			<StructuredTimeData
				title='Box Office Data'
				endpoint='/'
				time={lastUpdated}
			/>

			{/* Controls */}
			<div className='flex flex-wrap mb-2 items-center justify-center'>
				<Datepickers
					start={start}
					end={end}
					setStart={setStart}
					setEnd={setEnd}
				/>
				<ButtonGroup>
					<Button onClick={() => changeDate(7)} isActive={diffDays === 7}>
						1W
					</Button>
					<Button onClick={() => changeDate(30)} isActive={diffDays === 30}>
						1M
					</Button>
					<Button onClick={() => changeDate(90)} isActive={diffDays === 90}>
						3M
					</Button>
					<Button onClick={() => changeDate(365)} isActive={diffDays === 365}>
						1Y
					</Button>
				</ButtonGroup>
				<div className='text-sm md:ml-auto pt-4'>
					Last Updated: {lastUpdated}
				</div>
			</div>

			{/* Scorecards grid. */}
			{isReachedEnd ? (
				<div className='grid md:grid-cols-2 mt-10 lg:grid-cols-4 gap-4'>
					<Card
						title='Total Box Office'
						subtitle={`£${boxOffice.toLocaleString()}`}
					>
						{timeComparisonData && (
							<Tooltip text='Change from last year'>
								<MetricChange value={changeWeek} />{' '}
							</Tooltip>
						)}
					</Card>

					<Card
						title='Weekend Box Office'
						subtitle={`£${weekendBoxOffice.toLocaleString()}`}
					>
						{timeComparisonData && (
							<Tooltip text='Change from last year'>
								{' '}
								<MetricChange value={changeWeekend} />{' '}
							</Tooltip>
						)}
					</Card>

					<Card title='New Releases' subtitle={numberOfNewFilms}>
						{timeComparisonData && (
							<Tooltip text='Change from last year'>
								{' '}
								<MetricChange value={changeNewFilms} />{' '}
							</Tooltip>
						)}
					</Card>

					<Card title='Cinemas' subtitle={numberOfCinemas}>
						{timeComparisonData && (
							<Tooltip text='Change from last year'>
								{' '}
								<MetricChange value={changeCinemas} />{' '}
							</Tooltip>
						)}
					</Card>
				</div>
			) : (
				<SkeletonCards />
			)}

			{/* Charts */}
			{isReachedEnd ? (
				<div className='grid md:grid-cols-1 mt-10 lg:grid-cols-2 gap-4'>
					<div>{isReachedEnd && <TimeLineChart data={weekData} />}</div>
					<div>
						{isReachedEnd && (
							<MultipleFilmsChart data={areaData} labels={uniqueDates} />
						)}
					</div>
				</div>
			) : (
				<SkeletonCharts />
			)}

			{/* Table */}
			{isReachedEnd ? <FilmTable data={tableData} /> : <FilmTable data={[]} />}
		</div>
	);
};

export const Dashboard = () => {
	return (
		<Suspense fallback={<Skeleton />}>
			<DashboardPage />
		</Suspense>
	);
};
