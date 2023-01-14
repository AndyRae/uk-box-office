import { getDistributor } from './getDistributor';

export default async function Head({ params }: { params: { slug: string } }) {
	const distributor = await getDistributor(params.slug);

	return (
		<>
			<title>{`${distributor.name} | Box Office Data`}</title>
		</>
	);
}
