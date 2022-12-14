import { useBoxOfficeTopFilms } from '../../api/boxoffice';
import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { PageTitle } from '../../components/ui/PageTitle';
import { TopFilmsTable } from '../../components/Time/TopFilmsTable';

/**
 * Top Films Page
 * @returns {JSX.Element}
 */
const TopFilmsPage = () => {
	const { data, error, loading } = useBoxOfficeTopFilms();

	return (
		<>
			<PageTitle>All Time Top Films</PageTitle>

			{data && <TopFilmsTable data={data.results} />}
		</>
	);
};

/**
 * Top Films Page
 * Wrapped in a Suspense show a loading state while data is being fetched.
 * @returns {JSX.Element}
 */
export const TopFilms = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<TopFilmsPage />
		</Suspense>
	);
};
