import { useBoxOfficeInfinite, useBoxOfficeSummary } from '../api/boxoffice';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Suspense } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { Card } from '../components/Dashboard/Card';
import {
	groupForTable,
	calculateNumberOfCinemas,
	calculateWeek1Releases,
	groupbyDate,
} from '../utils/groupData';
import { MetricChange } from '../components/charts/MetricChange';
import DatePicker from 'react-datepicker';

export const DashboardPage = () => {
	const end = new Date();
	const start = new Date();
	start.setMonth(start.getMonth() - 6);

	const startDate = `${start.getFullYear()}-${
		start.getMonth() + 1
	}-${start.getDate()}`;
	const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;

	const { results, error } = useBoxOfficeInfinite(startDate, endDate);
	const { data: timeComparisonData } = useBoxOfficeSummary(
		startDate,
		endDate,
		1 // Years to go back.
	);

	// Group Data
	const { tableData } = groupForTable(results);
	const { results: weekData } = groupbyDate(results);

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

	const [startDate1, setStartDate] = useState(new Date());

	return (
		<div>
			{/* Datepickers */}

			<DatePicker
				selected={startDate1}
				onChange={(date) => setStartDate(date)}
			/>

			<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Card
					title='Total Box Office'
					subtitle={`£${boxOffice.toLocaleString()}`}
				>
					{timeComparisonData && <MetricChange value={changeWeek} />}
				</Card>

				<Card
					title='Weekend Box Office'
					subtitle={`£${weekendBoxOffice.toLocaleString()}`}
				>
					{timeComparisonData && <MetricChange value={changeWeekend} />}
				</Card>

				<Card title='New Releases' subtitle={numberOfNewFilms}>
					{timeComparisonData && <MetricChange value={changeNewFilms} />}
				</Card>

				<Card title='New Releases' subtitle={numberOfNewFilms}>
					{timeComparisonData && <MetricChange value={changeNewFilms} />}
				</Card>
			</div>

			{/* Scorecards grid. */}

			{/* Charts */}

			{/* Table */}

			{/* {data &&
				data.results.map((result) => {
					return (
						<div key={result.id}>
							<h2>{result.film}</h2>
							<Link to={`film/${result.film_slug}`}>Link</Link>
						</div>
					);
				})} */}
		</div>
	);
};

export const Dashboard = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<DashboardPage />
		</Suspense>
	);
};
