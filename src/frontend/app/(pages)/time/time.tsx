import {
	calculateYearChange,
	groupbyDateWithchange,
	groupForTableChange,
} from '@/lib/helpers/groupData';

import { BreadcrumbsTime } from '@/components/custom/breadcrumbs-time';
import { PageTitle } from '@/components/custom/page-title';
import { ExportCSV } from '@/components/custom/export-csv';
import { DescriptionItem } from '@/components/custom/description-item';
import { DescriptionList } from '@/components/custom/description-list';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StructuredTimeData } from '@/components/structured-data';
import { DatasourceButton } from '@/components/datasource';
import { MetricChange } from '@/components/metric-change';
import { StackedBarChart } from '@/components/charts/stacked-bar';
import { TimeLineChart } from '@/components/charts/timeline';
import { PreviousYearsChart } from '@/components/charts/previous-years';
import { ChartWrapper } from '@/components/charts/chart-wrapper';
import { BoxOfficeWeek, BoxOfficeSummary } from '@/interfaces/BoxOffice';
import { DataTable } from '@/components/vendor/data-table';
import { columns } from '@/components/tables/films-time';
import { columns as weeksColumns } from '@/components/tables/weeks';
import { columns as historicalColumns } from '@/components/tables/historical-years';
import { CountryFilter } from '@/components/country-filter';
import { ControlsWrapper } from '@/components/controls';
import { fetchCountryList } from '@/lib/api/dataFetching';
import { mapToValues } from '@/lib/helpers/filters';

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
export const TimePage = async ({
	year,
	month = undefined,
	day = undefined,
	quarter = undefined,
	quarterend = 0,
	results,
	lastWeekResults,
	timeComparisonData,
}: TimePageProps): Promise<JSX.Element> => {
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

	const countryData = await fetchCountryList(1, 100);
	const countryOptions = mapToValues(countryData.results);

	return (
		<>
			<StructuredTimeData
				title={`UK Box Office ${pageTitle}`}
				endpoint={'/time'}
				time={pageTitle}
			/>
			<ControlsWrapper className='hidden md:flex'>
				<BreadcrumbsTime year={year} month={month} quarter={quarter} />
				<CountryFilter countries={countryOptions} />
			</ControlsWrapper>

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

const TimeMetric = ({
	title,
	text,
	metricChange,
}: {
	title: string;
	text: any;
	metricChange: number;
}) => {
	return (
		<DescriptionItem title={title} text={text}>
			<p className='text-xs text-muted-foreground'>
				<MetricChange value={metricChange} /> from last year
			</p>
		</DescriptionItem>
	);
};

const TimeMetrics = ({
	timeComparisonData,
}: {
	timeComparisonData: BoxOfficeSummary[];
}) => {
	// Get Data for Metrics
	const thisYear = timeComparisonData[0];
	const boxOffice = thisYear?.week_gross ?? 0;
	const weekendBoxOffice = thisYear?.weekend_gross ?? 0;
	const numberOfNewFilms = thisYear?.number_of_releases ?? 0;
	const admissions = thisYear?.admissions ?? 0;
	const numberOfCinemas = thisYear?.number_of_cinemas ?? 0;
	const averageTicketPrice = parseInt((boxOffice / admissions!).toFixed(2));

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

	const hasAdmissions = admissions ? true : false;

	return (
		<DescriptionList>
			<TimeMetric
				title={'Total Box Office'}
				text={`£ ${boxOffice?.toLocaleString()}`}
				metricChange={changeWeek}
			/>

			<TimeMetric
				title={'Weekend Box Office'}
				text={`£ ${weekendBoxOffice?.toLocaleString()}`}
				metricChange={changeWeekend}
			/>

			<TimeMetric
				title={'New Releases'}
				text={numberOfNewFilms}
				metricChange={changeNewFilms}
			/>

			{hasAdmissions && (
				<TimeMetric
					title={'Admissions'}
					text={admissions?.toLocaleString()}
					metricChange={changeAdmissions}
				/>
			)}

			{hasAdmissions && (
				<TimeMetric
					title={'Average Ticket Price'}
					text={`£ ${averageTicketPrice?.toLocaleString()}`}
					metricChange={changeAverageTicketPrice}
				/>
			)}

			<TimeMetric
				title={'Cinemas'}
				text={numberOfCinemas}
				metricChange={changeCinemas}
			/>
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
				<ChartWrapper title='Box Office' className='my-4'>
					<TimeLineChart data={results} />
				</ChartWrapper>
			)}

			<ChartWrapper title='Films' className='my-4'>
				<StackedBarChart data={results} />
			</ChartWrapper>

			{timeComparisonData.length > 1 && (
				<ChartWrapper title='Previous Years' className='my-4'>
					<PreviousYearsChart data={timeComparisonData} />
				</ChartWrapper>
			)}
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
	const tableData = groupForTableChange(results, lastWeekResults);
	const weekData = groupbyDateWithchange(results);
	const yearData = calculateYearChange(timeComparisonData);

	const isWeekView = weekData.length === 1;

	return (
		<Tabs defaultValue='tab1'>
			<TabsList>
				<TabsTrigger value='tab1'>Films</TabsTrigger>
				<TabsTrigger value='tab2'>Weeks</TabsTrigger>
				<TabsTrigger value='tab3'>Previous Years</TabsTrigger>
			</TabsList>

			<TabsContent value='tab1'>
				<div className='flex flex-row-reverse mt-3 mb-3'>
					<DatasourceButton />
					<ExportCSV
						data={tableData}
						filename={'filmdata.csv'}
						className='mr-2'
					/>
				</div>

				<DataTable data={tableData} columns={columns} />
			</TabsContent>

			<TabsContent value='tab2'>
				<div className='flex flex-row-reverse mt-3 mb-3'>
					<DatasourceButton />
					<ExportCSV
						data={weekData}
						filename={'timedata.csv'}
						className='mr-2'
					/>
				</div>
				<DataTable columns={weeksColumns} data={weekData} />
			</TabsContent>

			<TabsContent value='tab3'>
				<div className='flex flex-row-reverse mt-3 mb-3'>
					<DatasourceButton />
					<ExportCSV
						data={timeComparisonData}
						filename={'historic.csv'}
						className='mr-2'
					/>
				</div>
				<DataTable columns={historicalColumns} data={yearData} />
			</TabsContent>
		</Tabs>
	);
};
