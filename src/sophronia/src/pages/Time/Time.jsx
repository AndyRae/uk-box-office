import { useProtectedSWRInfinite } from '../../api/boxoffice';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BoxOfficeTable } from '../../components/Film/BoxOfficeTable';
import { Card } from '../../components/Dashboard/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense } from 'react';
import { Date } from '../../components/Date';
import { useState, useEffect } from 'react';

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

	const [films, setFilms] = useState();
	const { data, size, setSize } = useProtectedSWRInfinite(startDate, endDate);

	const x = data ? [].concat(...data) : [];
	console.log(x);

	useEffect(() => {
		if (data != null) {
			setFilms(data);
		}
	}, [data]);

	console.log(size);
	if (size === 1) {
		setSize(2);
	}

	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>{year}</h1>
			<>hello {films && films[0].results.length}</>
			<button className={`button`} onClick={() => setSize(size + 1)}>
				button
			</button>
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
