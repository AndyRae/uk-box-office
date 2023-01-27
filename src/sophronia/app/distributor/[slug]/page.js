import { getDistributor } from './getDistributor';

import { PageTitle } from 'components/ui/PageTitle';
import { DistributorFilmsList } from './DistributorFilmsList';

export default async function Page({ params }) {
	const data = await getDistributor(params.slug);

	return (
		<div>
			<PageTitle title={data.name}>{data.name}</PageTitle>
			<DistributorFilmsList slug={params.slug} />
		</div>
	);
}
