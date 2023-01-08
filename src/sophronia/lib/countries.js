/**
 * @file Country API endpoints.
 * This file contains all the api calls for the countries resource.
 * @exports useCountryList
 * @exports useCountry
 * @exports useCountryFilms
 */

import { useBackendApi } from './ApiFetcher';
import useSWR from 'swr';

/**
 * Fetch keys for countries.
 * @type {Object}
 * @property {function} countryList - Country list endpoint.
 * @property {function} countryFilms - Country films endpoint.
 * @property {function} country - Country endpoint.
 */
export const fetchKeys = {
	countryList: (pageIndex, limit) =>
		`country/?page=${pageIndex}&limit=${limit}`,
	countryFilms: (slug, pageIndex, pageLimit) =>
		`country/${slug}/films?page=${pageIndex}&limit=${pageLimit}`,
	country: (slug) => `country/${slug}`,
};

/**
 * Get paginated list of countrys.
 * @param {number} pageIndex - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of countrys from the api.
 * @example
 * const { data, error } = useCountryList(1, 10);
 */
export const useCountryList = (pageIndex = 1, limit = 10) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.countryList(pageIndex, limit),
		async (url) => {
			const data = await apiFetcher(url);
			return data;
		},
		{ suspense: true }
	);
};

/**
 * Get a single country.
 * @param {string} slug - Country slug.
 * @returns a single country from the api.
 * @example
 * const { data, error } = useCountry('uk');
 */
export const useCountry = (slug) => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.country(slug), apiFetcher, {
		suspense: true,
	});
};

/**
 * Get a single countries and its films paginated.
 * @param {string} slug - Country slug.
 * @param {number} pageIndex - Page number to start from.
 * @param {number} pageLimit - Number of items per page.
 * @returns a single country and its paginated films from the api.
 * @example
 * const { data, error } = useCountryFilms('uk', 1, 10);
 */
export const useCountryFilms = (slug, pageIndex, pageLimit) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.countryFilms(slug, pageIndex, pageLimit),
		apiFetcher,
		{
			suspense: true,
		}
	);
};