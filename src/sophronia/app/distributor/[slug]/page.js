import { getBackendURL } from 'lib/ApiFetcher';

import { PageTitle } from 'components/ui/PageTitle';
import { DistributorFilmsList } from 'components/distributor/DistributorFilmsList';

export async function getDistributor(slug) {
	const url = getBackendURL();
	const res = await fetch(`${url}distributor/${slug}`, { cache: 'no-store' });
	return res.json();
}

export default async function Page({ params }) {
	const data = await getDistributor(params.slug);

	return (
		<div>
			<br></br>
			<PageTitle title={data.name}>{data.name}</PageTitle>
			<DistributorFilmsList slug={params.slug} />
		</div>
	);
}
