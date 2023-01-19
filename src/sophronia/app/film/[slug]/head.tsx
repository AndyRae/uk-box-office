import { getFilm } from './getFilm';

export default async function Head({ params }: { params: { slug: string } }) {
	const film = await getFilm(params.slug);
	const year = film.weeks[0].date.split('-')[0];

	const description = `${film.name} (${year}) was released in the UK on ${
		film.weeks[0].date
	}, and grossed £${film.gross.toLocaleString()} at the UK Box Office.`;

	return (
		<>
			<title>{`${film.name} ${year} | Box Office Data`}</title>
			<meta name='description' content={description} />
			<meta property='og:description' content={description} />
			<meta name='twitter:description' content={description} />
		</>
	);
}
