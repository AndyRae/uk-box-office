import { TimeLineChart } from '@/components/charts/timeline';
import { StackedBarChart } from '@/components/charts/stacked-bar';
import { ChartWrapper } from '@/components/charts/chart-wrapper';
import { DashboardControls } from '@/components/controls';
import { Scorecards } from '@/components/score-cards';
import { LastUpdated } from '@/components/last-updated';
import { DatasourceCard } from '@/components/datasource';
import { columns } from '@/components/tables/dashboard';
import { DataTable } from '@/components/vendor/data-table';

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
			<DashboardControls start={start} end={end}>
				<LastUpdated date={lastUpdated} />
				<DatasourceCard />
			</DashboardControls>

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
			<div className='mt-3 md:mt-6 h-screen overflow-scroll'>
				<DataTable columns={columns} data={[]} />
			</div>
		</div>
	);
};
