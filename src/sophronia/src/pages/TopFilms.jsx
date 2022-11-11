import { useBoxOfficeTopFilms } from '../api/boxoffice';
import { Suspense } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { PageTitle } from '../components/ui/PageTitle';
import { TopFilmsTable } from '../components/Time/TopFilmsTable';

const TopFilmsPage = () => {
	const { data, error, loading } = useBoxOfficeTopFilms();

	console.log(data);
	return (
		<>
			<PageTitle>All Time Top Films</PageTitle>

			{data && <TopFilmsTable data={data.results} />}
		</>
	);
};

export const TopFilms = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<TopFilmsPage />
		</Suspense>
	);
};
