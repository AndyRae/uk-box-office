import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BoxOfficeTable } from '../../components/Film/BoxOfficeTable';
import { Card } from '../../components/Dashboard/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense } from 'react';
import { useBoxOfficeInfinite } from '../../api/boxoffice';
import { groupForTable } from '../../utils/groupData';
import { FilmTable } from '../../components/Time/FilmTable';

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
	const { month } = useParams();
	const { day } = useParams();

	// TODO: Quarters, Weeks, etc. - see the Python code for algorithm.

	function getLastDayofMonth(month = 12) {
		const d = new Date(year, month, 0);
		return d.getDate();
	}
	const lastDay = getLastDayofMonth(month);

	const startDate = `${year ? year : 2022}-${month ? month : 1}-${
		day ? day : 1
	}`;
	const endDate = `${year ? year : 2022}-${month ? month : 12}-${
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

	// need to actually turn results into useable data - graphs and charts.
	const { results } = useBoxOfficeInfinite(startDate, endDate);

	const { tableData } = groupForTable(results);

	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>
				UK Box Office {day} {months[month]} {year}
			</h1>
			<div>
				<ul className='flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
					<PillLink to={`/time/${year}`}>{year}</PillLink>
					<PillLink to={`/time/${year}/q1`}>Q1</PillLink>
					<PillLink to={`/time/${year}/q2`}>Q2</PillLink>
					<PillLink to={`/time/${year}/q3`}>Q3</PillLink>
					<PillLink to={`/time/${year}/q4`}>Q4</PillLink>
				</ul>

				<ul className='flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
					{Object.keys(months).map((month) => (
						<PillLink key={month} to={`/time/${year}/m${month}`}>
							{months[month]}
						</PillLink>
					))}
				</ul>
			</div>
			<div>{results && <FilmTable data={tableData} />}</div>
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
