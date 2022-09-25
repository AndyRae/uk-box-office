import { useBackendApi } from './ApiFetcher';
import useSWR from 'swr';

export const fetchKeys = {
	distributorList: (pageIndex, pageLimit) =>
		`distributor/?start=${pageIndex}&limit=${pageLimit}`,
	distributorFilms: (slug, pageIndex, pageLimit) =>
		`distributor/${slug}/films?start=${pageIndex}&limit=${pageLimit}`,
	distributor: (slug) => `distributor/${slug}`,
};

/**
 * Get paginated list of distributors.
 */
export const useDistributorList = (pageIndex = 1, limit = 10) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.distributorList(pageIndex, limit),
		async (url) => {
			const data = await apiFetcher(url);
			return data;
		},
		{ suspense: true }
	);
};

/**
 * Get a single distributor.
 */
export const useDistributor = (id) => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.distributor(id), apiFetcher, {
		suspense: true,
	});
};

/**
 * Get a single distributor films.
 */
export const useDistributorFilms = (id, pageIndex = 1, pageLimit = 10) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.distributorFilms(id, pageIndex, pageLimit),
		apiFetcher,
		{
			suspense: true,
		}
	);
};
