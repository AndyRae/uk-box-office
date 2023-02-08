import { getDistributor } from './getDistributor';
import { PageTitle } from 'components/ui/PageTitle';
import { DistributorFilmsList } from './DistributorFilmsList';

export default async function Page({
	params,
}: {
	params: { slug: string };
}): Promise<JSX.Element> {
	const data = await getDistributor(params.slug);

	return (
		<div>
			<PageTitle>{data.name}</PageTitle>
			<DistributorFilmsList slug={params.slug} />
		</div>
	);
}
