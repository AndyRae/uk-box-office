/**
 * @file Film API hooks.
 * @exports useFilmList
 * @exports useFilm
 */

import { useBackendApi } from './ApiFetcher';
import useSWR from 'swr';

/**
 * Fetch keys for films.
 * @type {Object}
 * @property {function} filmList - Film list endpoint.
 * @property {function} film - Film endpoint.
 */
const fetchKeys = {
	filmList: (pageIndex, limit) => `film/?page=${pageIndex}&limit=${limit}`,
	film: (slug) => `film/${slug}`,
};

/**
 * Get paginated list of all films.
 * @param {number} pageIndex - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of films from the api.
 * @example
 * const { data, error } = useFilmList(1, 10);
 */
export const useFilmList = (pageIndex = 1, limit = 10) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.filmList(pageIndex, limit),
		async (url) => {
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
export const useFilm = (slug) => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.film(slug), apiFetcher, {
		suspense: true,
	});
};
