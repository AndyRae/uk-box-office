import { MetricChange } from '@/components/metric-change';
import { TimeLineChart } from '@/components/charts/timeline';
import { StackedBarChart } from '@/components/charts/stacked-bar';
import { Card } from '@/components/ui/card';
import { ChartWrapper } from '@/components/charts/chart-wrapper';
import { Controls } from '@/components/controls';
import { Scorecards } from '@/components/score-cards';
import { FilmTableDetailed } from '@/components/tables/film-table-detailed';
import { LastUpdated } from '@/components/last-updated';
import { DatasourceCard } from '@/components/datasource';

import { parseDate } from '@/lib/helpers/dates';
import addDays from 'date-fns/addDays';

/**
 * Dashboard Skeleton.
 */
export const Skeleton = () => {
	const start = parseDate(addDays(new Date(), -90));
	const end = parseDate(new Date());
	const timeComparisonData = {
		results: [
			{
				number_of_releases: 1,
				week_gross: 1,
				weekend_gross: 1,
				number_of_cinemas: 1,
				admissions: 1,
				year: '0',
			},
		],
	};

	const lastUpdated = '';

	return (
		<div className='transition ease-in-out animate-pulse'>
			{/* Controls */}
			<Controls start={start} end={end}>
				<LastUpdated date={lastUpdated} />
				<DatasourceCard />
			</Controls>

			{/* Scorecards grid. */}
			<Scorecards
				timeComparisonData={timeComparisonData.results}
				tableData={[]}
				results={[]}
			/>

			{/* Charts */}
			<div className='grid md:grid-cols-1 mt-3 md:mt-6 lg:grid-cols-2 gap-3 md:gap-5'>
				<ChartWrapper title='Box Office'>
					<TimeLineChart data={[]} height='md' />
				</ChartWrapper>

				<ChartWrapper title='Films' chartClassName='mt-6'>
					<StackedBarChart data={[]} height='md' />
				</ChartWrapper>
			</div>

			{/* Table */}
			<div className='mt-3 md:mt-6'>
				<FilmTableDetailed data={[]} />
			</div>
		</div>
	);
};

/**
 * @description Skeleton Card loading components for loading state
 * @returns {JSX.Element}
 */
export const SkeletonCards = (): JSX.Element => {
	return (
		<div className='grid animate-pulse md:grid-cols-2 mt-6 lg:grid-cols-4 gap-3 md:gap-5'>
			<Card
				title='Total Box Office'
				// subtitle='-'
				// status='transparent'
				className='border border-black dark:border-white'
			>
				<MetricChange value={0} />{' '}
			</Card>

			<Card
				title='Weekend Box Office'
				// subtitle='-'
				// status='transparent'
				className='border border-black dark:border-white'
			>
				<MetricChange value={0} />{' '}
			</Card>

			<Card
				title='New Releases'
				// subtitle='-'
				// status='transparent'
				className='border border-black dark:border-white'
			>
				<MetricChange value={0} />{' '}
			</Card>

			<Card
				title='New Releases'
				// subtitle='-'
				// status='transparent'
				className='border border-black dark:border-white'
			>
				<MetricChange value={0} />{' '}
			</Card>
		</div>
	);
};

/**
 * @description Skeleton Film Table loading components for loading state
 * @returns {JSX.Element}
 */
export const SkeletonCharts = (): JSX.Element => {
	return (
		<div className='grid md:grid-cols-1 lg:grid-cols-2 mt-3 md:mt-6 gap-3 md:gap-5 animate-pulse transition'>
			<ChartWrapper title='Box Office'>
				<TimeLineChart data={[]} height='md' />
			</ChartWrapper>

			<ChartWrapper title='Films' chartClassName='mt-6'>
				<StackedBarChart data={[]} height='md' />
			</ChartWrapper>
		</div>
	);
};
