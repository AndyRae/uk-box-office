import { useFilmList } from '../../api/films';
import { useState } from 'react';
import { FilmList } from '../../components/Film/FilmList';
import { Pagination } from '../../components/ui/Pagination';
import { paginate } from '../../utils/pagination';
import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';

export const FilmsPage = () => {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data, error } = useFilmList(pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	return (
		<>
			<h1 className='text-4xl font-bold'>Films</h1>
			<FilmList films={data} pageIndex={pageIndex} />
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
};

export const Films = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<FilmsPage />
		</Suspense>
	);
};
