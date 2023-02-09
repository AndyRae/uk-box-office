/**
 * @file Film API hooks.
 * @exports useFilmList
 * @exports useFilm
 */

import { useBackendApi } from './ApiFetcher';
import useSWR from 'swr';
import { FilmWithWeeks, FilmListData } from 'interfaces/Film';

/**
 * Fetch keys for films.
 * @type {Object}
 * @property {function} filmList - Film list endpoint.
 * @property {function} film - Film endpoint.
 */
const fetchKeys: any = {
	filmList: (pageIndex: number, limit: number) =>
		`film/?page=${pageIndex}&limit=${limit}`,
	film: (slug: string) => `film/${slug}`,
};

/**
 * Get paginated list of all films.
 * @param {number} pageIndex - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of films from the api.
 * @example
 * const { data, error } = useFilmList(1, 10);
 */
export const useFilmList = (
	pageIndex: number = 1,
	limit: number = 10
): { data?: FilmListData; error?: any } => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.filmList(pageIndex, limit),
		async (url: string) => {
			const data = await apiFetcher(url);
			return data;
		},
		{ suspense: true }
	);
};

/**
 * Get a single film by slug.
 * @param {string} slug - Film slug.
 * @returns a single film from the api.
 * @example
 * const { data, error } = useFilm('uk');
 */
export const useFilm = (
	slug: string
): { data?: FilmWithWeeks; error?: any } => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.film(slug), apiFetcher, {
		suspense: true,
	});
};
