import { getBackendURL } from 'lib/ApiFetcher';
import Film from 'interfaces/Film';

/**
 * Get a single film.
 * @param {string} slug - Film slug.
 * @returns a single film from the api.
 * @example
 * const film = await getFilm('the-dark-knight');
 */
export async function getFilm(slug: string): Promise<Film> {
	const url = getBackendURL();
	const res = await fetch(`${url}film/${slug}`);
	return res.json();
}
