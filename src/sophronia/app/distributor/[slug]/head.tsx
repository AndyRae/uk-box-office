// import { getDistributor } from './getDistributor';
import DefaultTags from '../../DefaultTags';

// Remove async headers as broken in Next 13.1.1
// See: https://github.com/vercel/next.js/issues/43972
// export default async function Head({ params }: { params: { slug: string } }) {
// 	const distributor = await getDistributor(params.slug);

// 	const description = `Get ${distributor.name} distributed films data at the UK Box Office.`;

// 	return (
// 		<>
// 			<title>{`${distributor.name} | Box Office Data`}</title>
// 			<DefaultTags description={description} />
// 		</>
// 	);
// }

export default async function Head({ params }: { params: { slug: string } }) {
	return (
		<>
			<title>Distributors | Box Office Data</title>
			<DefaultTags />
		</>
	);
}
