import { getFilm } from './page';

export default async function Head({ params }: { params: { slug: string } }) {
	const film = await getFilm(params.slug);

	const title = `${film.name} | ${film.distributor.name}`;

	return (
		<>
			<title>{title}</title>
			<meta name='viewport' content='width=device-width, initial-scale=1' />
		</>
	);
}
