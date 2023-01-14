import { getBackendURL } from 'lib/ApiFetcher';

import { PageTitle } from 'components/ui/PageTitle';
import { CountryFilmsList } from './CountryFilmsList';

import { getCountry } from './getCountry';

export default async function Page({ params }) {
	const data = await getCountry(params.slug);

	return (
		<div>
			<PageTitle title={data.name}>{data.name}</PageTitle>
			<CountryFilmsList slug={params.slug} />
		</div>
	);
}
