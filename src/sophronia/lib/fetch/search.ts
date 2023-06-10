/**
 * @file Search API.
 * This file contains all the api calls for the search resource.
 * @exports useSearch
 */

import { getApi } from './api';
import { Country } from 'interfaces/Country';
import { Distributor } from 'interfaces/Distributor';
import { Film } from 'interfaces/Film';

interface SearchResults {
	countries: Country[];
	distributors: Distributor[];
	films: {
		count: number;
		next: number;
		previous: number;
		results: Film[];
		distributors: Distributor[];
		countries: Country[];
		max_gross: number;
	};
}

interface SearchParams {
	q: string;
	distributor?: string;
	country?: string;
	max_box?: string;
	min_box?: string;
}

/**
 * Fetch keys for search.
 * @type {Object}
 * @property {function} search - Search endpoint.
 */
const fetchKeys = {
	search: (query: string) => `${getApi()}/search?${query}`,
};

/**
 * Search for films, distributors, and countries.
 * @param {string} query - Search query.
 * @returns search results from the api.
 * @example
 * const { data, error } = useSearch('uk');
 */
export const useSearch = async (
	searchParams: SearchParams
): Promise<SearchResults> => {
	const { q, distributor, country, max_box, min_box } = searchParams;
	const urlSearchParams = new URLSearchParams();

	// Add query parameter
	urlSearchParams.append('q', q);

	// Add distributor parameter if provided
	if (distributor) {
		urlSearchParams.append('distributor', distributor);
	}

	// Add country parameter if provided
	if (country) {
		urlSearchParams.append('country', country);
	}

	// Add min box if provided
	if (min_box) {
		urlSearchParams.append('min_box', min_box);
	}

	// Add max box if provided
	if (max_box) {
		urlSearchParams.append('max_box', max_box);
	}

	const res = await fetch(fetchKeys.search(urlSearchParams.toString()), {
		cache: 'no-store',
	});
	return res.json();
};
