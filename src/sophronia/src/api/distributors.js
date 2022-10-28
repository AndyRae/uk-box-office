import { useBackendApi } from './ApiFetcher';
import useSWR from 'swr';

export const fetchKeys = {
	distributorList: (pageIndex, pageLimit) =>
		`distributor/?page=${pageIndex}&limit=${pageLimit}`,
	distributorFilms: (slug, pageIndex, pageLimit) =>
		`distributor/${slug}/films?page=${pageIndex}&limit=${pageLimit}`,
	distributor: (slug) => `distributor/${slug}`,
	marketShareYear: (year) => `distributor/marketshare/${year}`,
	marketShare: `distributor/marketshare`,
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

/**
 * Get market share data for distributors.
 * @returns Market share data for distributors.
 */
export const useDistributorMarketShare = () => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.marketShare, apiFetcher, {
		suspense: true,
	});
};

/**
 * Get market share data for distributors for a year.
 * @returns Market share data for distributors.
 */
export const useDistributorMarketShareYear = (year) => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.marketShareYear(year), apiFetcher, {
		suspense: true,
	});
};
