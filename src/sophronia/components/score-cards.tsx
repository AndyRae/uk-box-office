import { Card } from './ui/card';
import { MetricChange } from './metric-change';
import {
	TooltipProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from './ui/tooltip';
import {
	calculateWeek1Releases,
	calculateNumberOfCinemas,
} from 'lib/utils/groupData';

import {
	BoxOfficeSummary,
	TableData,
	BoxOfficeWeek,
} from 'interfaces/BoxOffice';

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
		<Card
			title={title}
			subtitle={subtitle}
			status='transparent'
			className='border border-black dark:border-white'
		>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<MetricChange value={metricChange} />
					</TooltipTrigger>
					<TooltipContent>
						<p>Change from last year</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</Card>
	);
};

export const Scorecards = ({
	timeComparisonData,
	tableData,
	results,
}: {
	timeComparisonData?: { results: BoxOfficeSummary[] };
	tableData: TableData;
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

	if (timeComparisonData && timeComparisonData.results.length >= 1) {
		const lastYear = timeComparisonData!.results[0];

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
		changeCinemas = Math.ceil(
			((numberOfCinemas - lastYear.number_of_cinemas) /
				lastYear.number_of_cinemas) *
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
