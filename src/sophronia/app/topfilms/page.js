import { getBackendURL } from 'lib/ApiFetcher';
import { PageTitle } from 'components/ui/PageTitle';
import { TopFilmsTable } from 'components/Time/TopFilmsTable';

async function getTopFilms() {
	const url = getBackendURL();
	const res = await fetch(`${url}boxoffice/topfilms`, { cache: 'no-store' });
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
