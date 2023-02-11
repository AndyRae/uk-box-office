import { getBackendURL } from 'lib/ApiFetcher';
import { PageTitle } from 'components/ui/PageTitle';
import { TopFilmsTable } from './TopFilmsTable';
import { TopFilm } from 'interfaces/Film';

/**
 * Get the top films from the backend
 * @returns {Promise<{ results: TopFilm[] }>}
 */
async function getTopFilms(): Promise<{ results: TopFilm[] }> {
	const url = getBackendURL();
	const res = await fetch(`${url}boxoffice/topfilms`);
	return res.json();
}

export default async function Page(): Promise<JSX.Element> {
	const data = await getTopFilms();
	return (
		<>
			<PageTitle>All Time Top Films</PageTitle>
			<TopFilmsTable data={data.results} />
		</>
	);
}
