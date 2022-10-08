import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Dashboard/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense } from 'react';
import { useBoxOfficeInfinite } from '../../api/boxoffice';
import {
	groupForTable,
	calculateNumberOfCinemas,
	calculateWeek1Releases,
	groupbyDate,
} from '../../utils/groupData';
import { FilmTable } from '../../components/Time/FilmTable';
import { WeeksTable } from '../../components/Time/WeeksTable';
import { useState } from 'react';
import { Tab, Tabs, TabContent, TabTitle } from '../../components/ui/Tabs';

const PillLink = ({ to, children }) => (
	<li className='mr-2'>
		<Link
			to={to}
			className='inline-block py-3 px-4 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
		>
			{children}
		</Link>
	</li>
);

export const TimePage = () => {
	// Unpack dates to be flexible for Year, Month, Day being null.
	const { year } = useParams();
	let { month } = useParams();
	let endMonth = month;
	const { day } = useParams();
	const { quarter } = useParams();
	const { quarterend = 0 } = useParams();

	// Quarters unpack
	if (quarter) {
		month = quarter * 3 - 2;
		if (quarterend != 0) {
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

	const startDate = `${year ? year : 2022}-${month ? month : 1}-${
		day ? day : 1
	}`;
	const endDate = `${year ? year : 2022}-${endMonth ? endMonth : 12}-${
		day ? day : lastDay
	}`;

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

	const { results } = useBoxOfficeInfinite(startDate, endDate);

	const { tableData } = groupForTable(results);
	const { results: weekData } = groupbyDate(results);

	const boxOffice = tableData.reduce((acc, curr) => acc + curr.weekGross, 0);
	const weekendBoxOffice = tableData.reduce(
		(acc, curr) => acc + curr.weekendGross,
		0
	);
	const numberOfNewFilms = calculateWeek1Releases(results);
	const numberOfCinemas = calculateNumberOfCinemas(results);

	// Tabs
	const [currentTab, setCurrentTab] = useState('1');
	const handleTabClick = (e) => {
		setCurrentTab(e.target.id);
	};

	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>
				UK Box Office {day} {quarter ? `Q${quarter}` : months[month]}{' '}
				{quarterend ? `- Q${quarterend}` : null} {year}
			</h1>

			<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Card
					title='Total Box Office'
					subtitle={`£${boxOffice.toLocaleString()}`}
				/>

				<Card
					title='Weekend Box Office'
					subtitle={`£${weekendBoxOffice.toLocaleString()}`}
				/>

				<Card title='New Releases' subtitle={`${numberOfNewFilms}`} />

				<Card title='Number of Cinemas' subtitle={`${numberOfCinemas}`} />
			</div>

			{/* // Chart */}

			<div className='py-3'>
				<ul className='flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
					<PillLink to={`/time/${year}`}>{year}</PillLink>
					<PillLink to={`/time/${year}/q1`}>Q1</PillLink>
					<PillLink to={`/time/${year}/q2`}>Q2</PillLink>
					<PillLink to={`/time/${year}/q3`}>Q3</PillLink>
					<PillLink to={`/time/${year}/q4`}>Q4</PillLink>
				</ul>

				{/* Months */}
				<ul className='flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
					{Object.keys(months).map((month) => (
						<PillLink key={month} to={`/time/${year}/m${month}`}>
							{months[month]}
						</PillLink>
					))}
				</ul>
			</div>

			<Tabs>
				<TabTitle
					id={1}
					label={'films'}
					isActive={currentTab === 1 ? true : false}
					onClick={handleTabClick}
				>
					Films
				</TabTitle>
				<TabTitle
					id={2}
					label={'weeks'}
					isActive={currentTab === 2 ? true : false}
					onClick={handleTabClick}
				>
					Weeks
				</TabTitle>
			</Tabs>

			<TabContent>
				{currentTab === '1' && (
					<Tab>{results && <FilmTable data={tableData} />}</Tab>
				)}
				{currentTab === '2' && (
					<Tab>{weekData && <WeeksTable data={weekData} />}</Tab>
				)}
			</TabContent>
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
