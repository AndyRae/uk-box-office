// 'use client';

import { parseISO } from 'date-fns';
import {
	fetchBoxOfficeInfinite,
	fetchBoxOfficePreviousYear,
} from 'lib/fetch/box';
import { Button } from 'components/ui/button';
import { ButtonGroup } from 'components/ui/button-group';
import { Card } from 'components/ui/card';
import {
	groupForTable,
	calculateNumberOfCinemas,
	calculateWeek1Releases,
} from 'lib/utils/groupData';
import { MetricChange } from 'components/metric-change';
import { Datepickers } from 'components/datepickers';
import { FilmTableDetailed } from 'components/tables/film-table-detailed';
import { TimeLineChart } from 'components/charts/timeline';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from 'components/ui/tooltip';
import { SkeletonCards } from 'components/skeleton';
import { StructuredTimeData } from 'components/structured-data';
import { LastUpdated } from 'components/last-updated';
import { StackedBarChart } from 'components/charts/stacked-bar';
import { DatasourceCard } from 'components/datasource';
import { ChartWrapper } from 'components/charts/chart-wrapper';
import { parseDate } from 'lib/utils/dates';

export default async function Home({
	searchParams,
}: {
	searchParams: { s?: string; e?: string };
}): Promise<JSX.Element> {
	// TODO: Work out how to move this out.
	Date.prototype.addDays = function (days) {
		var date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	};

	// Calculate defaults at 90 days.
	const s = parseDate(new Date().addDays(-90));
	const e = parseDate(new Date());

	// Get dates from the searchparams.
	const start = searchParams?.s ?? s;
	const end = searchParams?.e ?? e;

	// Fetch data from the API
	const { results, isReachedEnd, percentFetched } =
		await fetchBoxOfficeInfinite(start, end);
	const { data: timeComparisonData } = await fetchBoxOfficePreviousYear(
		start,
		end
	);

	// Group Data for the charts
	const tableData = groupForTable(results);

	const lastUpdated = results[0]?.date;

	return (
		<div className='transition ease-in-out'>
			<StructuredTimeData
				title='Box Office Data'
				endpoint='/'
				time={lastUpdated}
			/>

			{/* Controls */}
			<Controls start={start} end={end} lastUpdated={lastUpdated} />

			{/* Scorecards grid. */}
			{isReachedEnd ? (
				<Scorecards
					timeComparisonData={timeComparisonData}
					tableData={tableData}
					results={results}
				/>
			) : (
				<SkeletonCards />
			)}

			{/* Charts */}
			<div className='grid md:grid-cols-1 mt-3 md:mt-6 lg:grid-cols-2 gap-3 md:gap-5'>
				<ChartWrapper title='Box Office'>
					<TimeLineChart data={isReachedEnd ? results : []} height='md' />
				</ChartWrapper>

				<ChartWrapper title='Films' chartClassName='mt-6'>
					<StackedBarChart data={isReachedEnd ? results : []} height='md' />
				</ChartWrapper>
			</div>

			{/* Table */}
			<div className='mt-3 md:mt-6'>
				{isReachedEnd ? (
					<FilmTableDetailed data={tableData} />
				) : (
					<FilmTableDetailed data={[]} />
				)}
			</div>
		</div>
	);
}

const Controls = ({
	start,
	end,
	lastUpdated,
}: {
	start: string;
	end: string;
	lastUpdated: string;
}) => {
	// Buttons for the date picker
	const changeDate = async (days: number) => {
		const today = new Date();
		// setStart(today.addDays(-days));
	};

	// Work out the difference between the last two dates
	// Used to set the active button
	// const diffTime = Math.abs(s.getTime() - start.getTime());
	// const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	const diffDays = 7;

	return (
		<div className='flex flex-wrap mb-2 gap-y-4 items-center justify-center'>
			<Datepickers startParam={start} endParam={end} />
			<ButtonGroup>
				{/* <Button onClick={() => changeDate(7)} isActive={diffDays === 7}>
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
				</Button> */}
			</ButtonGroup>

			<LastUpdated date={lastUpdated} />

			<DatasourceCard />
		</div>
	);
};

const Scorecards = ({ timeComparisonData, tableData, results }: any) => {
	// Calculate totals
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
	let changeCinemas = 0;

	if (timeComparisonData && timeComparisonData.results.length >= 1) {
		const lastYear = timeComparisonData!.results[0];

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

	return (
		<div className='grid md:grid-cols-2 mt-6 lg:grid-cols-4 gap-3 md:gap-5'>
			<Card
				title='Total Box Office'
				subtitle={`£${boxOffice.toLocaleString()}`}
				status='transparent'
				className='border border-black dark:border-white'
			>
				{timeComparisonData && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<MetricChange value={changeWeek} />
							</TooltipTrigger>
							<TooltipContent>
								<p>Change from last year</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</Card>

			<Card
				title='Weekend Box Office'
				subtitle={`£${weekendBoxOffice.toLocaleString()}`}
				status='transparent'
				className='border border-black dark:border-white'
			>
				{timeComparisonData && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<MetricChange value={changeWeekend} />
							</TooltipTrigger>
							<TooltipContent>
								<p>Change from last year</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</Card>

			<Card
				title='New Releases'
				subtitle={numberOfNewFilms}
				status='transparent'
				className='border border-black dark:border-white'
			>
				{timeComparisonData && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<MetricChange value={changeNewFilms} />
							</TooltipTrigger>
							<TooltipContent>
								<p>Change from last year</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</Card>

			<Card
				title='Cinemas'
				subtitle={numberOfCinemas}
				status='transparent'
				className='border border-black dark:border-white'
			>
				{timeComparisonData && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<MetricChange value={changeCinemas} />
							</TooltipTrigger>
							<TooltipContent>
								<p>Change from last year</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</Card>
		</div>
	);
};
