import { getBackendURL } from 'lib/ApiFetcher';
import { PageTitle } from 'components/ui/PageTitle';
import { TopFilmsTable } from './TopFilmsTable';

async function getTopFilms() {
	const url = getBackendURL();
	const res = await fetch(`${url}boxoffice/topfilms`);
	return res.json();
}

export default async function Page() {
	const data = await getTopFilms();
	return (
		<>
			<PageTitle>All Time Top Films</PageTitle>
			<TopFilmsTable data={data.results} />
		</>
	);
}
