/**
 * @file Film API hooks.
 * @exports useFilmList
 * @exports useFilm
 */

import { getApi } from './api';
import { FilmWithWeeks, FilmListData } from 'interfaces/Film';

/**
 * Fetch keys for films.
 * @type {Object}
 * @property {function} filmList - Film list endpoint.
 * @property {function} film - Film endpoint.
 */
const fetchKeys: any = {
	filmList: (pageIndex: number, limit: number) =>
		`${getApi()}/film/?page=${pageIndex}&limit=${limit}`,
	filmSlug: (slug: string) => `${getApi()}/film/slug/${slug}`,
	filmId: (slug: string) => `${getApi()}/film/id/${slug}`,
};

/**
 * Get paginated list of all films.
 * @param {number} pageIndex - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of films from the api.
 * @example
 * const { data, error } = useFilmList(1, 10);
 */
export const useFilmList = async (
	pageIndex: number = 1,
	limit: number = 10
): Promise<FilmListData> => {
	const res = await fetch(fetchKeys.filmList(pageIndex, limit));
	return res.json();
};

/**
 * Get a single film.
 * @param {string} slug - Film slug.
 * @returns a single film from the api.
 * @example
 * const film = await getFilm('the-dark-knight');
 */
export async function getFilm(slug: string): Promise<FilmWithWeeks> {
	const res = await fetch(fetchKeys.filmSlug(slug));
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
	const res = await fetch(fetchKeys.filmId(id));
	return res.json();
}
