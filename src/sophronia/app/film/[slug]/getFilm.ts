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
