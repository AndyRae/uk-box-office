import { getBackendURL } from 'lib/ApiFetcher';
import { FilmWithWeeks } from 'interfaces/Film';

/**
 * Get a single film.
 * @param {string} slug - Film slug.
 * @returns a single film from the api.
 * @example
 * const film = await getFilm('the-dark-knight');
 */
export async function getFilm(slug: string): Promise<FilmWithWeeks> {
	const url = getBackendURL();
	const res = await fetch(`${url}film/slug/${slug}`);
	return res.json();
}

/**
 * Get a single film.
 * @param {string} id - Film id.
 * @returns a single film from the api.
 * @example
 * const film = await getFilm(100);
 */
export async function getFilmId(id: number): Promise<FilmWithWeeks> {
	const url = getBackendURL();
	const res = await fetch(`${url}film/id/${id}`);
	return res.json();
}
