/**
 * @file Search API.
 * This file contains all the api calls for the search resource.
 * @exports useSearch
 */

import { useBackendApi } from './ApiFetcher';
import useSWR from 'swr';

/**
 * Fetch keys for search.
 * @type {Object}
 * @property {function} search - Search endpoint.
 */
const fetchKeys = {
	search: (query: string) => `search?q=${query}`,
};

/**
 * Search for films, distributors, and countries.
 * @param {string} query - Search query.
 * @returns search results from the api.
 * @example
 * const { data, error } = useSearch('uk');
 */
export const useSearch = (query: string) => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.search(query), apiFetcher, {
		suspense: true,
	});
};
