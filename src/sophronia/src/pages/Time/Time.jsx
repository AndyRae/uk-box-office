import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BoxOfficeTable } from '../../components/Film/BoxOfficeTable';
import { Card } from '../../components/Dashboard/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense } from 'react';
import { Date } from '../../components/Date';
import { useBoxOfficeInfinite } from '../../api/boxoffice';
import { groupForTable } from '../../utils/groupData';
import { FilmTable } from '../../components/Time/FilmTable';

export const TimePage = () => {
	// Unpack dates to be flexible for Year, Month, Day being null.
	const { year } = useParams();
	const { month } = useParams();
	const { day } = useParams();

	const startDate = `${year ? year : 2022}-${month ? month : 1}-${
		day ? day : 1
	}`;
	const endDate = `${year ? year : 2022}-${month ? month : 12}-${
		day ? day : 31
	}`;

	// need to actually turn results into useable data - graphs and charts.
	const { results } = useBoxOfficeInfinite(startDate, endDate);

	const { tableData } = groupForTable(results);

	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>
				UK Box Office {day} {month} {year}
			</h1>
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
