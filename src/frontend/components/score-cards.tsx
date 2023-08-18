import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricChange } from './metric-change';
import {
	calculateWeek1Releases,
	calculateNumberOfCinemas,
} from '@/lib/helpers/groupData';

import {
	BoxOfficeSummary,
	TableData,
	BoxOfficeWeek,
} from '@/interfaces/BoxOffice';

const ScoreCard = ({
	title,
	subtitle,
	metricChange,
}: {
	title: string;
	subtitle: string | number;
	metricChange?: any;
}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{subtitle}</div>
				<p className='text-xs text-muted-foreground'>
					<MetricChange value={metricChange} /> from last year
				</p>
			</CardContent>
		</Card>
	);
};

export const Scorecards = ({
	timeComparisonData,
	tableData,
	results,
}: {
	timeComparisonData?: BoxOfficeSummary[];
	tableData: TableData[];
	results: BoxOfficeWeek[];
}) => {
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

	if (timeComparisonData) {
		const lastYear = timeComparisonData[0];

		changeNewFilms = Math.ceil(
			((numberOfNewFilms - lastYear?.number_of_releases) /
				lastYear?.number_of_releases) *
				100
		);
		changeWeek = Math.ceil(
			((boxOffice - lastYear?.week_gross) / lastYear?.week_gross) * 100
		);
		changeWeekend = Math.ceil(
			((weekendBoxOffice - lastYear?.weekend_gross) / lastYear?.weekend_gross) *
				100
		);
		changeCinemas = Math.ceil(
			((numberOfCinemas - lastYear?.number_of_cinemas) /
				lastYear?.number_of_cinemas) *
				100
		);
	}

	return (
		<div className='grid md:grid-cols-2 mt-6 lg:grid-cols-4 gap-3 md:gap-5'>
			<ScoreCard
				title='Total Box Office'
				subtitle={`£${boxOffice.toLocaleString()}`}
				metricChange={changeWeek}
			/>

			<ScoreCard
				title='Weekend Box Office'
				subtitle={`£${weekendBoxOffice.toLocaleString()}`}
				metricChange={changeWeekend}
			/>

			<ScoreCard
				title='New Releases'
				subtitle={numberOfNewFilms}
				metricChange={changeNewFilms}
			/>

			<ScoreCard
				title='Cinemas'
				subtitle={numberOfCinemas}
				metricChange={changeCinemas}
			/>
		</div>
	);
};
