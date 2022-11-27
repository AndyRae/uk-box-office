import { useBackendApi } from './ApiFetcher';
import useSWR from 'swr';

export const fetchKeys = {
	search: (query) => `search?q=${query}`,
};

/**
 * Search for films, distributors, and countries.
 */
export const useSearch = (query) => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.search(query), apiFetcher, {
		suspense: true,
	});
};
