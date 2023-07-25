import {
	fetchBoxOfficeInfinite,
	fetchBoxOfficePreviousYear,
} from 'lib/dataFetching';
import { groupForTable } from 'lib/utils/groupData';
import { Controls } from 'components/controls';
import { FilmTableDetailed } from 'components/tables/film-table-detailed';
import { TimeLineChart } from 'components/charts/timeline';
import { StructuredTimeData } from 'components/structured-data';
import { StackedBarChart } from 'components/charts/stacked-bar';
import { ChartWrapper } from 'components/charts/chart-wrapper';
import { parseDate } from 'lib/utils/dates';
import { Scorecards } from 'components/score-cards';
import addDays from 'date-fns/addDays';
import { LastUpdated } from 'components/last-updated';
import { DatasourceCard } from 'components/datasource';
import * as React from 'react';
import { Skeleton } from 'components/skeleton';

export default async function Page({
	searchParams,
}: {
	searchParams: { s?: string; e?: string };
}): Promise<JSX.Element> {
	const keyString = `${searchParams.s}-${searchParams.e}`;
	return (
		<React.Suspense key={keyString} fallback={<Skeleton />}>
			{/* @ts-expect-error Server Component */}
			<Dashboard searchParams={searchParams} />
		</React.Suspense>
	);
}

/**
 * Wrapping in suspense until NextJs app directory supports shallow routing.
 */
async function Dashboard({
	searchParams,
}: {
	searchParams: { s?: string; e?: string };
}): Promise<JSX.Element> {
	// Calculate defaults at 90 days.
	const s = parseDate(addDays(new Date(), -90));
	const e = parseDate(new Date());

	// Get dates from the searchparams.
	const start = searchParams?.s ?? s;
	const end = searchParams?.e ?? e;

	// Fetch data from the API
	const { results, isReachedEnd } = await fetchBoxOfficeInfinite(start, end);
	const timeComparisonData = await fetchBoxOfficePreviousYear(start, end);

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
			<Controls start={start} end={end}>
				<LastUpdated date={lastUpdated} />
				<DatasourceCard />
			</Controls>

			{/* Scorecards grid. */}
			<Scorecards
				timeComparisonData={timeComparisonData.results}
				tableData={tableData}
				results={results}
			/>

			{/* Charts */}
			<div className='grid md:grid-cols-1 mt-3 md:mt-6 lg:grid-cols-2 gap-3 md:gap-5'>
				<ChartWrapper title='Box Office'>
					<TimeLineChart data={results} height='md' />
				</ChartWrapper>

				<ChartWrapper title='Films' chartClassName='mt-6'>
					<StackedBarChart data={results} height='md' />
				</ChartWrapper>
			</div>

			{/* Table */}
			<div className='mt-3 md:mt-6 h-screen'>
				<FilmTableDetailed data={tableData} />
			</div>
		</div>
	);
}
