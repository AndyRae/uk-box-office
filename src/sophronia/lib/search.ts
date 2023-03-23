/**
 * @file Search API.
 * This file contains all the api calls for the search resource.
 * @exports useSearch
 */

import { getBackendURL } from './ApiFetcher';
import { Country } from 'interfaces/Country';
import { Distributor } from 'interfaces/Distributor';
import { Film } from 'interfaces/Film';

interface SearchResults {
	countries: Country[];
	distributors: Distributor[];
	films: Film[];
}

/**
 * Fetch keys for search.
 * @type {Object}
 * @property {function} search - Search endpoint.
 */
const fetchKeys = {
	search: (query: string) => `${getBackendURL()}search?q=${query}`,
};

/**
 * Search for films, distributors, and countries.
 * @param {string} query - Search query.
 * @returns search results from the api.
 * @example
 * const { data, error } = useSearch('uk');
 */
export const useSearch = async (query: string): Promise<SearchResults> => {
	const res = await fetch(fetchKeys.search(query));
	return res.json();
};
