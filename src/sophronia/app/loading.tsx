import { Controls } from 'components/controls';
import { ChartWrapper } from 'components/charts/chart-wrapper';
import { Scorecards } from 'components/score-cards';
import { TimeLineChart } from 'components/charts/timeline';
import { StackedBarChart } from 'components/charts/stacked-bar';
import { FilmTableDetailed } from 'components/tables/film-table-detailed';
import { parseDate } from 'lib/utils/dates';
import addDays from 'date-fns/addDays';

export default function Loading() {
	const start = parseDate(addDays(new Date(), -90));
	const end = parseDate(new Date());
	const timeComparisonData = {
		results: [],
	};

	const lastUpdated = '';

	return (
		<div className='transition ease-in-out animate-pulse'>
			{/* Controls */}
			<Controls start={start} end={end} lastUpdated={lastUpdated} />

			{/* Scorecards grid. */}
			<Scorecards
				timeComparisonData={timeComparisonData}
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
}
