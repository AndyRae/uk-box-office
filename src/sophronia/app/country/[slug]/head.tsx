import DefaultTags from '../../DefaultTags';
import { getCountry } from './getCountry';

// Remove async headers as broken in Next 13.1.1
// See: https://github.com/vercel/next.js/issues/43972
// export default async function Head({ params }: { params: { slug: string } }) {
// 	const country = await getCountry(params.slug);

// 	const description = `Get ${country.name} released films data at the UK Box Office.`;

// 	return (
// 		<>
// 			<title>{`${country.name} | Box Office Data`}</title>
// 			<meta name='description' content={description} />
// 			<meta property='og:description' content={description} />
// 			<meta name='twitter:description' content={description} />
// 		</>
// 	);
// }

export default async function Head({ params }: { params: { slug: string } }) {
	return (
		<>
			<title>Countries | Box Office Data</title>
			<DefaultTags />
		</>
	);
}
