import { getDistributor } from './getDistributor';
import DefaultTags from '../../DefaultTags';

export default async function Head({ params }: { params: { slug: string } }) {
	const distributor = await getDistributor(params.slug);

	const description = `Get ${distributor.name} distributed films data at the UK Box Office.`;

	return (
		<>
			<title>{`${distributor.name} | Box Office Data`}</title>
			<DefaultTags description={description} />
		</>
	);
}
