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
	sort_asc?: string;
	sort_desc?: string;
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
	const {
		q,
		distributor,
		country,
		min_box: minBox,
		max_box: maxBox,
		min_year: minYear,
		max_year: maxYear,
		p: page,
		sort_asc: sortAsc,
		sort_desc: sortDesc,
	} = searchParams;
	const urlSearchParams = new URLSearchParams();

	// Add query parameter
	urlSearchParams.append('q', q);

	// Add parameters if provided
	distributor && urlSearchParams.append('distributor', distributor);
	country && urlSearchParams.append('country', country);
	minBox && urlSearchParams.append('min_box', minBox);
	maxBox && urlSearchParams.append('max_box', maxBox);
	minYear && urlSearchParams.append('min_year', minYear);
	maxYear && urlSearchParams.append('max_year', maxYear);
	page && urlSearchParams.append('p', page);
	sortAsc && urlSearchParams.append('sort_asc', sortAsc);
	sortDesc && urlSearchParams.append('sort_desc', sortDesc);

	const res = await fetch(fetchKeys.search(urlSearchParams.toString()), {
		cache: 'no-store',
	});
	return res.json();
};
