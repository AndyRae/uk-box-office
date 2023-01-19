import { getDistributor } from './getDistributor';

export default async function Head({ params }: { params: { slug: string } }) {
	const distributor = await getDistributor(params.slug);

	const description = `Get ${distributor.name} distributed films data at the UK Box Office.`;

	return (
		<>
			<title>{`${distributor.name} | Box Office Data`}</title>
			<meta name='description' content={description} />
			<meta property='og:description' content={description} />
			<meta name='twitter:description' content={description} />
		</>
	);
}
