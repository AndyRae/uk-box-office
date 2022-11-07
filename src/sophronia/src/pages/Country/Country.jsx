import { useCountryFilms } from '../../api/countries';
import { useParams } from 'react-router-dom';
import { Suspense, useState, useEffect } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { FilmList } from '../../components/Film/FilmList';
import { Pagination } from '../../components/ui/Pagination';
import { paginate } from '../../utils/pagination';

export const CountryPage = () => {
	const { slug } = useParams();

	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data, error } = useCountryFilms(slug, pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	useEffect(() => {
		document.title = `${data?.country.name} - UK Box Office Data`;
	}, []);

	return (
		<>
			<h1 className='text-4xl font-bold mb-10'>{data.country.name}</h1>
			<FilmList films={data} pageIndex={pageIndex} />
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
};

export const Country = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<CountryPage />
		</Suspense>
	);
};
