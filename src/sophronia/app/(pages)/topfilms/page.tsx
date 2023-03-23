import { getApi } from 'lib/fetch/api';
import { PageTitle } from 'components/ui/page-title';
import { TopFilmsTable } from 'components/tables/top-films-table';
import { TopFilm } from 'interfaces/Film';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'All Time Top Films | Box Office Data',
	description:
		'Top 50 films of all time at the UK box office. Including dashboards, statistics, reports, and analysis.',
};

/**
 * Get the top films from the backend
 * @returns {Promise<{ results: TopFilm[] }>}
 */
async function getTopFilms(): Promise<{ results: TopFilm[] }> {
	const url = getApi();
	const res = await fetch(`${url}/boxoffice/topfilms`);
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
