import { getFilm } from './page';

export default async function Head({ params }: { params: { slug: string } }) {
	const film = await getFilm(params.slug);

	const title = `${film.name} | Box Office Data`;

	return (
		<>
			<title>{title}</title>
		</>
	);
}
