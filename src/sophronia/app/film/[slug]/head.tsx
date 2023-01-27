import DefaultTags from '../../DefaultTags';
// import { getFilm } from './getFilm';

// Remove async headers as broken in Next 13.1.1
// See: https://github.com/vercel/next.js/issues/43972
// export default async function Head({ params }: { params: { slug: string } }) {
// 	const film = await getFilm(params.slug);
// 	const year = film.weeks[0].date.split('-')[0];

// 	const description = `${film.name} (${year}) was released in the UK on ${
// 		film.weeks[0].date
// 	}, and grossed £${film.gross.toLocaleString()} at the UK Box Office.`;

// 	return (
// 		<>
// 			<title>{`${film.name} ${year} | Box Office Data`}</title>
// 			<DefaultTags description={description} />
// 		</>
// 	);
// }

export default async function Head({ params }: { params: { slug: string } }) {
	return (
		<>
			<title>Films | Box Office Data</title>
			<DefaultTags />
		</>
	);
}
