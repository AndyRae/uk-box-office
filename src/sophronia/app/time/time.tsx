'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { groupForTable, groupbyDate } from 'lib/utils/groupData';

import { PageTitle } from 'components/ui/PageTitle';
import { ProgressBar } from 'components/ui/ProgressBar';
import { Tooltip } from 'components/ui/Tooltip';
import { Tabs } from 'components/ui/Tabs';
import { Card } from 'components/ui/Card';
import { ExportCSV } from 'components/ui/ExportCSV';
import { ListItem } from 'components/ui/ListItem';
import { DescriptionList } from 'components/ui/DescriptionList';
import { StructuredTimeData } from 'components/StructuredData';
import { DatasourceButton } from 'components/Dashboard/Datasource';
import { MetricChange } from 'components/charts/MetricChange';
import { StackedBarChart } from 'components/charts/StackedBarChart';
import { TimeLineChart } from 'components/charts/TimeLineChart';
import { FilmTableDetailed } from 'components/Time/FilmTableDetailed';

import { WeeksTable } from './WeeksTable';
import { PreviousTable } from './PreviousTable';
import { PreviousYearsChart } from './PreviousYearsChart';

import { useBoxOfficeInfinite, useBoxOfficeSummary } from 'lib/boxoffice';

type PillLinkProps = {
	to: string;
	children: React.ReactNode;
	isActive: boolean;
};

/**
 * Pill Link Component
 * @param {string} to - Link to
 * @param {JSX.Element} children - Children
 * @param {boolean} isActive - Is active
 * @returns {JSX.Element}
 */
const PillLink = ({ to, children, isActive }: PillLinkProps) => (
	<li className='mr-2'>
		<Link
			href={to}
			className={`inline-block py-3 px-4 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white ${
				isActive
					? 'text-gray-900 bg-gray-100 dark:bg-gray-900 dark:text-white'
					: ''
			}`}
		>
			{children}
		</Link>
	</li>
);

type TimePageProps = {
	year: number;
	month?: number;
	day?: number;
	quarter?: number;
	quarterend?: number;
};

declare global {
	interface Date {
		addDays(days: number): Date;
	}
}

Date.prototype.addDays = function (days: number): Date {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
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
}: TimePageProps): JSX.Element => {
	const pathname = usePathname();

	// Unpack dates to allow flexbility for Month/Day/Quarter being null.
	// Year is never null.

	// Month has to be unpacked differently to allow for quarters calculations.
	let endMonth = month;

	// Quarters unpack
	if (quarter) {
		month = quarter * 3 - 2;
		if (quarterend !== 0) {
			endMonth = quarterend * 3;
		} else {
			endMonth = quarter * 3;
		}
	}

	function getLastDayofMonth(month = 12) {
		const d = new Date(year, month, 0);
		return d.getDate();
	}
	const lastDay = getLastDayofMonth(endMonth);

	// Build Dates based on existing params or defaults.
	const start = new Date(
		year ? year : 2022,
		month ? month - 1 : 0,
		day ? day : 1
	);
	const end = new Date(
		year ? year : 2022,
		endMonth ? endMonth - 1 : 11,
		day ? day : lastDay
	);

	// Build Date Strings for API
	const startDate = `${start.getFullYear()}-${
		start.getMonth() + 1
	}-${start.getDate()}`;
	const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;

	const sLastWeek = start.addDays(-7);
	const eLastWeek = end.addDays(-7);
	const startLastWeek = `${sLastWeek.getFullYear()}-${
		sLastWeek.getMonth() + 1
	}-${sLastWeek.getDate()}`;
	const endLastWeek = `${eLastWeek.getFullYear()}-${
		eLastWeek.getMonth() + 1
	}-${eLastWeek.getDate()}`;

	// To check if we're on a week page.
	const isWeekView = startDate === endDate;

	// Set Grid Columns for charts.
	let gridColumns = 'md:grid-cols-1';
	if (isWeekView) {
		gridColumns = 'md:grid-cols-2';
	}

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

	// Fetch Data
	const { results, isReachedEnd, percentFetched } = useBoxOfficeInfinite(
		startDate,
		endDate
	);
	const { results: lastWeekResults } = useBoxOfficeInfinite(
		startLastWeek,
		endLastWeek
	);
	const { data: timeComparisonData } = useBoxOfficeSummary(
		startDate,
		endDate,
		25 // Years to go back.
	);

	// Group Data
	const tableData = groupForTable(results);
	const { results: weekData } = groupbyDate(results);

	// Get Data for Charts
	const thisYear = timeComparisonData!.results[0];
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

	if (timeComparisonData && timeComparisonData.results.length > 1) {
		const lastYear = timeComparisonData.results[1];

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

	const pageTitle = `${day ? day : ''} ${
		quarter ? `Q${quarter}` : month ? months[month as keyof MonthsType] : ''
	}${quarterend ? ` - Q${quarterend}` : ''} ${year}`;

	return (
		<>
			<StructuredTimeData
				title={`UK Box Office ${pageTitle}`}
				endpoint={pathname as string}
				time={pageTitle}
			/>

			<div className='grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-5'>
				<div className='col-span-2'>
					<PageTitle>UK Box Office {pageTitle}</PageTitle>

					<DescriptionList>
						<ListItem
							title={'Total Box Office'}
							text={`£ ${boxOffice.toLocaleString()}`}
						>
							<Tooltip text='Change from last year'>
								<MetricChange value={changeWeek} />
							</Tooltip>
						</ListItem>

						<ListItem
							title={'Weekend Box Office'}
							text={`£ ${weekendBoxOffice.toLocaleString()}`}
						>
							<Tooltip text='Change from last year'>
								<MetricChange value={changeWeekend} />
							</Tooltip>
						</ListItem>

						<ListItem title={'New Releases'} text={numberOfNewFilms}>
							<Tooltip text='Change from last year'>
								<MetricChange value={changeNewFilms} />
							</Tooltip>
						</ListItem>

						<ListItem title={'Admissions'} text={admissions?.toLocaleString()}>
							<Tooltip text='Change from last year'>
								<MetricChange value={changeAdmissions} />
							</Tooltip>
						</ListItem>

						<ListItem
							title={'Average Ticket Price'}
							text={`£ ${averageTicketPrice.toLocaleString()}`}
						>
							<Tooltip text='Change from last year'>
								<MetricChange value={changeAverageTicketPrice} />
							</Tooltip>
						</ListItem>

						<ListItem
							title={'Site Average'}
							text={`£ ${siteAverage.toLocaleString()}`}
						/>
						<ListItem title={'Cinemas'} text={numberOfCinemas}>
							<Tooltip text='Change from last year'>
								<MetricChange value={changeCinemas} />
							</Tooltip>
						</ListItem>
					</DescriptionList>
				</div>

				<div className='col-span-3 flex flex-col gap-4 divide-y divide-gray-200 dark:divide-gray-700'>
					{!isReachedEnd ? (
						<ProgressBar value={percentFetched} />
					) : (
						<>
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
								<PreviousYearsChart data={timeComparisonData!.results} />
							</div>
						</>
					)}
				</div>
			</div>

			<div className='py-3'>
				<ul className='flex flex-wrap my-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
					<PillLink to={`/time/${year}`} isActive={true}>
						{year}
					</PillLink>
					<PillLink
						to={`/time/${year}/q/1`}
						isActive={quarter?.toString() === '1'}
					>
						Q1
					</PillLink>
					<PillLink
						to={`/time/${year}/q/2`}
						isActive={quarter?.toString() === '2'}
					>
						Q2
					</PillLink>
					<PillLink
						to={`/time/${year}/q/3`}
						isActive={quarter?.toString() === '3'}
					>
						Q3
					</PillLink>
					<PillLink
						to={`/time/${year}/q/4`}
						isActive={quarter?.toString() === '4'}
					>
						Q4
					</PillLink>
				</ul>

				{/* Months */}
				<ul className='flex flex-wrap lg:flex-nowrap flex- text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
					{Object.keys(months).map((m) => (
						<PillLink
							key={m}
							to={`/time/${year}/m/${m}`}
							isActive={m === month?.toString()}
						>
							{months[parseInt(m) as keyof MonthsType]}
						</PillLink>
					))}
				</ul>
			</div>
			<Tabs
				tabs={[
					{
						id: '1',
						title: 'Films',
					},
					{
						id: '2',
						title: 'Weeks',
					},
					{
						id: '3',
						title: 'Previous Years',
					},
				]}
			>
				<div>
					{results && (
						<>
							<div className='flex flex-row-reverse mt-3'>
								<DatasourceButton />
								<ExportCSV data={tableData} filename={'filmdata.csv'} />
							</div>
							<FilmTableDetailed
								data={tableData}
								comparisonData={isWeekView ? lastWeekResults : undefined}
							/>
						</>
					)}
				</div>
				<div>
					{weekData && (
						<>
							<div className='flex flex-row-reverse mt-3'>
								<DatasourceButton />
								<ExportCSV data={weekData} filename={'timedata.csv'} />
							</div>
							<WeeksTable data={weekData} />
						</>
					)}
				</div>
				<div>
					{timeComparisonData && (
						<>
							<div className='flex flex-row-reverse mt-3'>
								<DatasourceButton />
								<ExportCSV
									data={timeComparisonData.results}
									filename={'historic.csv'}
								/>
							</div>
							<PreviousTable data={timeComparisonData.results} />
						</>
					)}
				</div>
			</Tabs>
		</>
	);
};
