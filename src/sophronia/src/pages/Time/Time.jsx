import { useBoxOffice } from '../../api/boxoffice';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BoxOfficeTable } from '../../components/Film/BoxOfficeTable';
import { Card } from '../../components/Dashboard/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense } from 'react';
import { Date } from '../../components/Date';

export const TimePage = () => {
	// Unpack dates to be flexible for Year, Month, Day being null.
	const { year } = useParams();
	const { month } = useParams();
	const { day } = useParams();

	const start = `${year ? year : 2022}-${month ? month : 1}-${day ? day : 1}`;
	const end = `${year ? year : 2022}-${month ? month : 12}-${day ? day : 31}`;

	const { data, error } = useBoxOffice(start, end, 1, 150);

	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>{year}</h1>
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
