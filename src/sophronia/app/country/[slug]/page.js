import { getBackendURL } from 'lib/ApiFetcher';

import { PageTitle } from 'components/ui/PageTitle';
import { CountryFilmsList } from './CountryFilmsList';

export async function getCountry(slug) {
	const url = getBackendURL();
	const res = await fetch(`${url}country/${slug}`, { cache: 'no-store' });
	return res.json();
}

export default async function Page({ params }) {
	const data = await getCountry(params.slug);

	return (
		<div>
			<PageTitle title={data.name}>{data.name}</PageTitle>
			<CountryFilmsList slug={params.slug} />
		</div>
	);
}
