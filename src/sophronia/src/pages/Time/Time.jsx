import { useParams, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Dashboard/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense } from 'react';
import { useBoxOfficeInfinite, useBoxOfficeSummary } from '../../api/boxoffice';
import {
	groupForTable,
	calculateNumberOfCinemas,
	calculateWeek1Releases,
	groupbyDate,
	groupStackedFilms,
} from '../../utils/groupData';
import { FilmTable } from '../../components/Time/FilmTable';
import { WeeksTable } from '../../components/Time/WeeksTable';
import { Tabs } from '../../components/ui/Tabs';
import { MetricChange } from '../../components/charts/MetricChange';
import { PreviousTable } from '../../components/Time/PreviousTable';
import { ExportCSV } from '../../components/ui/ExportCSV';
import { TimeLineChart } from '../../components/Time/TimeLineChart';
import { Tooltip } from '../../components/ui/Tooltip';
import { StructuredTimeData } from '../../components/StructuredData';
import { PageTitle } from '../../components/ui/PageTitle';
import { StackedBarChart } from '../../components/charts/StackedBarChart';
import { DatasourceButton } from '../../components/Dashboard/Datasource';
import { ProgressBar } from '../../components/ui/ProgressBar';

const PillLink = ({ to, children, isActive }) => (
	<li className='mr-2'>
		<Link
			to={to}
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

export const TimePage = () => {
	const location = useLocation();

	// Unpack dates to be flexible for Year, Month, Day being null.
	const { year, day, quarter, quarterend = 0 } = useParams();
	let { month } = useParams();
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

	Date.prototype.addDays = function (days) {
		var date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	};

	function getLastDayofMonth(month = 12) {
		const d = new Date(year, month, 0);
		return d.getDate();
	}
	const lastDay = getLastDayofMonth(endMonth);

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

	const months = {
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
	const { tableData } = groupForTable(results);
	const { areaData } = groupStackedFilms(results);
	const { results: weekData } = groupbyDate(results);
	const uniqueDates = [...new Set(results.map((d) => d.date))];

	const boxOffice = tableData.reduce((acc, curr) => acc + curr.weekGross, 0);
	const weekendBoxOffice = tableData.reduce(
		(acc, curr) => acc + curr.weekendGross,
		0
	);
	const numberOfNewFilms = calculateWeek1Releases(results);

	// Time Comparison Data
	let changeNewFilms = 0;
	let changeWeekend = 0;
	let changeWeek = 0;

	if (timeComparisonData.results.length > 1) {
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
	}

	const pageTitle = `${day ? day : ''} ${
		quarter ? `Q${quarter}` : month ? months[month] : ''
	}${quarterend ? ` - Q${quarterend}` : ''} ${year}`;

	return (
		<div>
			<StructuredTimeData
				title={`UK Box Office ${pageTitle}`}
				endpoint={location.pathname}
				time={pageTitle}
			/>
			<PageTitle>UK Box Office {pageTitle}</PageTitle>

			{isReachedEnd ? '' : <ProgressBar value={percentFetched} />}

			<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5'>
				<Card
					title='Total Box Office'
					subtitle={isReachedEnd && `£${boxOffice.toLocaleString()}`}
				>
					{isReachedEnd && (
						<Tooltip text='Change from last year'>
							<MetricChange value={changeWeek} />{' '}
						</Tooltip>
					)}
				</Card>

				<Card
					title='Weekend Box Office'
					subtitle={isReachedEnd && `£${weekendBoxOffice.toLocaleString()}`}
				>
					{isReachedEnd && (
						<Tooltip text='Change from last year'>
							{' '}
							<MetricChange value={changeWeekend} />{' '}
						</Tooltip>
					)}
				</Card>

				<Card
					title='New Releases'
					subtitle={isReachedEnd && `${numberOfNewFilms}`}
				>
					{isReachedEnd && (
						<Tooltip text='Change from last year'>
							{' '}
							<MetricChange value={changeNewFilms} />{' '}
						</Tooltip>
					)}
				</Card>

				<Card title='Box Office Previous Years'>
					{isReachedEnd &&
						timeComparisonData.results.slice(1, 4).map((year, index) => {
							return (
								<div key={index} className='text-center'>
									<Link
										to={`/time/${year.year}${
											quarter ? '/q' + quarter : month ? '/m' + month : ''
										}${quarterend ? '/q' + quarterend : ''}`}
										className='font-bold text-left'
									>
										{year.year}
									</Link>
									: {`£${year.week_gross.toLocaleString()}`}
								</div>
							);
						})}
				</Card>
			</div>

			{/* // Chart */}
			<div className='mt-3 mb-3 md:mb-6 md:mt-6'>
				{weekData &&
					weekData.length > 1 &&
					(isReachedEnd ? (
						<Card title='Box Office'>
							<TimeLineChart data={weekData} />
						</Card>
					) : (
						<Card title='Box Office'>
							<TimeLineChart data={[]} />
						</Card>
					))}
			</div>

			<Card title='Films'>
				{isReachedEnd && (
					<StackedBarChart data={areaData} labels={uniqueDates} />
				)}
			</Card>

			<div className='py-3'>
				<ul className='flex flex-wrap my-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
					<PillLink to={`/time/${year}`} isActive={true}>
						{year}
					</PillLink>
					<PillLink to={`/time/${year}/q1`} isActive={quarter === '1'}>
						Q1
					</PillLink>
					<PillLink to={`/time/${year}/q2`} isActive={quarter === '2'}>
						Q2
					</PillLink>
					<PillLink to={`/time/${year}/q3`} isActive={quarter === '3'}>
						Q3
					</PillLink>
					<PillLink to={`/time/${year}/q4`} isActive={quarter === '4'}>
						Q4
					</PillLink>
				</ul>

				{/* Months */}
				<ul className='flex flex-wrap lg:flex-nowrap flex- text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
					{Object.keys(months).map((m) => (
						<PillLink key={m} to={`/time/${year}/m${m}`} isActive={m === month}>
							{months[m]}
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
							<FilmTable
								data={tableData}
								comparisonData={isWeekView && lastWeekResults}
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
		</div>
	);
};

export const Time = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<TimePage />
		</Suspense>
	);
};
