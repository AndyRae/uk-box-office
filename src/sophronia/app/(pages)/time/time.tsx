import { groupForTable, groupbyDate } from 'lib/utils/groupData';

import { BreadcrumbsTime } from 'components/ui/breadcrumbs-time';
import { PageTitle } from 'components/ui/page-title';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from 'components/ui/tooltip';
import { ExportCSV } from 'components/ui/export-csv';
import { DescriptionItem } from 'components/ui/description-item';
import { DescriptionList } from 'components/ui/description-list';
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'components/ui/tabs';
import { StructuredTimeData } from 'components/structured-data';
import { DatasourceButton } from 'components/datasource';
import { MetricChange } from 'components/metric-change';
import { StackedBarChart } from 'components/charts/stacked-bar';
import { TimeLineChart } from 'components/charts/timeline';
import { FilmTableDetailed } from 'components/tables/film-table-detailed';
import { WeeksTable } from 'components/tables/weeks-table';
import { PreviousTable } from 'components/tables/previous-years-table';
import { PreviousYearsChart } from 'components/charts/previous-years';
import { BoxOfficeWeek, BoxOfficeSummary } from 'interfaces/BoxOffice';

type TimePageProps = {
	year: number;
	month?: number;
	day?: number;
	quarter?: number;
	quarterend?: number;
	results: BoxOfficeWeek[];
	lastWeekResults?: BoxOfficeWeek[];
	timeComparisonData: BoxOfficeSummary[];
};

/**
 * Time Page
 * @returns {JSX.Element}
 */
export const TimePage = ({
	year,
	month = undefined,
	day = undefined,
	quarter = undefined,
	quarterend = 0,
	results,
	lastWeekResults,
	timeComparisonData,
}: TimePageProps): JSX.Element => {
	type MonthsType = {
		[key: number]: string;
	};

	const months: MonthsType = {
		1: 'January',
		2: 'February',
		3: 'March',
		4: 'April',
		5: 'May',
		6: 'June',
		7: 'July',
		8: 'August',
		9: 'September',
		10: 'October',
		11: 'November',
		12: 'December',
	};

	const pageTitle = `${day ? day : ''} ${
		quarter ? `Q${quarter}` : month ? months[month as keyof MonthsType] : ''
	}${quarterend ? ` - Q${quarterend}` : ''} ${year}`;

	return (
		<>
			<StructuredTimeData
				title={`UK Box Office ${pageTitle}`}
				endpoint={'/time'}
				time={pageTitle}
			/>
			<BreadcrumbsTime year={year} month={month} />

			<div className='grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5'>
				<div className='col-span-2'>
					<PageTitle>UK Box Office {pageTitle}</PageTitle>

					<TimeMetrics timeComparisonData={timeComparisonData} />
				</div>

				<TimeCharts results={results} timeComparisonData={timeComparisonData} />
			</div>

			<TimeTabs
				results={results}
				timeComparisonData={timeComparisonData}
				lastWeekResults={lastWeekResults}
			/>
		</>
	);
};

const TimeMetrics = ({
	timeComparisonData,
}: {
	timeComparisonData: BoxOfficeSummary[];
}) => {
	// Get Data for Metrics
	const thisYear = timeComparisonData[0];
	const boxOffice = thisYear.week_gross;
	const weekendBoxOffice = thisYear.weekend_gross;
	const numberOfNewFilms = thisYear.number_of_releases;
	const admissions = thisYear.admissions;
	const numberOfCinemas = thisYear.number_of_cinemas;
	const averageTicketPrice = parseInt((boxOffice / admissions!).toFixed(2));
	const siteAverage = Math.ceil(boxOffice / numberOfCinemas);

	// Time Comparison Data
	let changeNewFilms = 0;
	let changeWeekend = 0;
	let changeWeek = 0;
	let changeAdmissions = 0;
	let changeCinemas = 0;
	let changeAverageTicketPrice = 0;

	if (timeComparisonData && timeComparisonData.length > 1) {
		const lastYear = timeComparisonData[1];

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
		changeAdmissions = Math.ceil(
			((admissions! - lastYear.admissions!) / lastYear.admissions!) * 100
		);
		changeCinemas = Math.ceil(
			((numberOfCinemas - lastYear.number_of_cinemas) /
				lastYear.number_of_cinemas) *
				100
		);

		changeAverageTicketPrice = Math.ceil(
			((averageTicketPrice - lastYear.week_gross / lastYear.admissions!) /
				(lastYear.week_gross / lastYear.admissions!)) *
				100
		);
	}

	return (
		<DescriptionList>
			<DescriptionItem
				title={'Total Box Office'}
				text={`£ ${boxOffice.toLocaleString()}`}
			>
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
			</DescriptionItem>

			<DescriptionItem
				title={'Weekend Box Office'}
				text={`£ ${weekendBoxOffice.toLocaleString()}`}
			>
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
			</DescriptionItem>

			<DescriptionItem title={'New Releases'} text={numberOfNewFilms}>
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
			</DescriptionItem>

			{admissions && (
				<DescriptionItem
					title={'Admissions'}
					text={admissions?.toLocaleString()}
				>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<MetricChange value={changeAdmissions} />
							</TooltipTrigger>
							<TooltipContent>
								<p>Change from last year</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</DescriptionItem>
			)}

			{admissions && (
				<DescriptionItem
					title={'Average Ticket Price'}
					text={`£ ${averageTicketPrice.toLocaleString()}`}
				>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<MetricChange value={changeAverageTicketPrice} />
							</TooltipTrigger>
							<TooltipContent>
								<p>Change from last year</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</DescriptionItem>
			)}

			<DescriptionItem
				title={'Site Average'}
				text={`£ ${siteAverage.toLocaleString()}`}
			/>
			<DescriptionItem title={'Cinemas'} text={numberOfCinemas}>
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
			</DescriptionItem>
		</DescriptionList>
	);
};

const TimeCharts = ({
	results,
	timeComparisonData,
}: {
	results: BoxOfficeWeek[];
	timeComparisonData: BoxOfficeSummary[];
}) => {
	// Checks if the results are all the same date
	const isWeekView = results.every(
		(week, index) => index === 0 || week.date === results[0].date
	);

	return (
		<div className='col-span-3 flex flex-col gap-4 divide-y divide-gray-200 dark:divide-gray-700'>
			{!isWeekView && (
				<div className='my-4'>
					<p className='font-bold text-sm text-gray-700 dark:text-gray-400'>
						Box Office
					</p>
					<TimeLineChart data={results} />
				</div>
			)}

			<div className='my-4'>
				<p className='font-bold text-sm text-gray-700 dark:text-gray-400 mt-4'>
					Films
				</p>
				<StackedBarChart data={results} />
			</div>

			<div className='my-4'>
				<p className='font-bold text-sm text-gray-700 dark:text-gray-400 mt-4'>
					Previous Years
				</p>
				<PreviousYearsChart data={timeComparisonData} />
			</div>
		</div>
	);
};

const TimeTabs = ({
	results,
	timeComparisonData,
	lastWeekResults,
}: {
	results: BoxOfficeWeek[];
	timeComparisonData: BoxOfficeSummary[];
	lastWeekResults?: BoxOfficeWeek[];
}) => {
	// Group Data
	const tableData = groupForTable(results);
	const { results: weekData } = groupbyDate(results);

	const isWeekView = weekData.length === 1;

	return (
		<Tabs defaultValue='tab1'>
			<TabsList>
				<TabsTrigger value='tab1'>Films</TabsTrigger>
				<TabsTrigger value='tab2'>Weeks</TabsTrigger>
				<TabsTrigger value='tab3'>Previous Years</TabsTrigger>
			</TabsList>

			<TabsContent value='tab1'>
				<div className='flex flex-row-reverse mt-3'>
					<DatasourceButton />
					<ExportCSV data={tableData} filename={'filmdata.csv'} />
				</div>
				<FilmTableDetailed
					data={tableData}
					comparisonData={isWeekView ? lastWeekResults : undefined}
				/>
			</TabsContent>

			<TabsContent value='tab2'>
				<div className='flex flex-row-reverse mt-3'>
					<DatasourceButton />
					<ExportCSV data={weekData} filename={'timedata.csv'} />
				</div>
				<WeeksTable data={weekData} />
			</TabsContent>

			<TabsContent value='tab3'>
				<div className='flex flex-row-reverse mt-3'>
					<DatasourceButton />
					<ExportCSV data={timeComparisonData} filename={'historic.csv'} />
				</div>
				<PreviousTable data={timeComparisonData} />
			</TabsContent>
		</Tabs>
	);
};
