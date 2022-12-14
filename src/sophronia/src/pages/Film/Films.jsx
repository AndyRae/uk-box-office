import { useFilmList } from '../../api/films';
import { useState } from 'react';
import { FilmList } from '../../components/Film/FilmList';
import { Pagination } from '../../components/ui/Pagination';
import { paginate } from '../../utils/pagination';
import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { PageTitle } from '../../components/ui/PageTitle';

/**
 * Films Page
 * @returns {JSX.Element}
 */
export const FilmsPage = () => {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data, error } = useFilmList(pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Films</PageTitle>
			<FilmList films={data} pageIndex={pageIndex} />
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
};

/**
 * Films Page
 * Wrapped in a Suspense show a loading state while data is being fetched.
 * @returns {JSX.Element}
 */
export const Films = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<FilmsPage />
		</Suspense>
	);
};
