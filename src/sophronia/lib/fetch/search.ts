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
	p?: string;
	min_year?: string;
	max_year?: string;
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
	const { q, distributor, country, min_box, max_box, min_year, max_year, p } =
		searchParams;
	const urlSearchParams = new URLSearchParams();

	// Add query parameter
	urlSearchParams.append('q', q);

	// Add parameters if provided
	distributor && urlSearchParams.append('distributor', distributor);
	country && urlSearchParams.append('country', country);
	min_box && urlSearchParams.append('min_box', min_box);
	max_box && urlSearchParams.append('max_box', max_box);
	min_year && urlSearchParams.append('min_year', min_year);
	max_year && urlSearchParams.append('max_year', max_year);
	p && urlSearchParams.append('p', p);

	const res = await fetch(fetchKeys.search(urlSearchParams.toString()), {
		cache: 'no-store',
	});
	return res.json();
};
