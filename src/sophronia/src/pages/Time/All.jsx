import { useBoxOfficeTop } from '../../api/boxoffice';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BoxOfficeTable } from '../../components/Film/BoxOfficeTable';
import { Card } from '../../components/Dashboard/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense } from 'react';
import { Date } from '../../components/Date';

export const AllTimePage = () => {
	const { data, error } = useBoxOfficeTop();

	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>All Time.</h1>

			<Link to={`/time/2022`}>2022</Link>
			<br />

			<Link to={`/time/2021`}>2021</Link>
			<br />

			<Link to={`/time/2020`}>2020</Link>
			<br />

			<Link to={`/time/2019`}>2019</Link>
			<br />
		</div>
	);
};

export const All = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<AllTimePage />
		</Suspense>
	);
};
