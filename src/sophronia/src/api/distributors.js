/**
 * @file Distributor API hooks.
 * @exports useDistributorList
 * @exports useDistributor
 * @exports useDistributorFilms
 * @exports useDistributorMarketShare
 * @exports useDistributorMarketShareYear
 */

import { useBackendApi } from './ApiFetcher';
import useSWR from 'swr';

/**
 * Fetch keys for distributors.
 * @type {Object}
 * @property {function} distributorList - Distributor list endpoint.
 * @property {function} distributorFilms - Distributor films endpoint.
 * @property {function} distributor - Distributor endpoint.
 * @property {function} marketShareYear - Distributor market share endpoint.
 * @property {function} marketShare - Distributor market share endpoint.
 */
const fetchKeys = {
	distributorList: (pageIndex, pageLimit) =>
		`distributor/?page=${pageIndex}&limit=${pageLimit}`,
	distributorFilms: (slug, pageIndex, pageLimit) =>
		`distributor/${slug}/films?page=${pageIndex}&limit=${pageLimit}`,
	distributor: (slug) => `distributor/${slug}`,
	marketShareYear: (year) => `distributor/marketshare/${year}`,
	marketShare: `distributor/marketshare`,
};

/**
 * Get paginated list of all distributors.
 * @param {number} pageIndex - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of distributors from the api.
 * @example
 * const { data, error } = useDistributorList(1, 10);
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
 * @param {string} slug - Distributor slug.
 * @returns a single distributor from the api.
 * @example
 * const { data, error } = useDistributor('mubi');
 */
export const useDistributor = (slug) => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.distributor(slug), apiFetcher, {
		suspense: true,
	});
};

/**
 * Get a single distributor films.
 * @param {string} slug - Distributor slug.
 * @param {number} pageIndex - Page number to start from.
 * @param {number} pageLimit - Number of items per page.
 * @returns a single distributor and its films from the api.
 * @example
 * const { data, error } = useDistributorFilms('mubi', 1, 10);
 */
export const useDistributorFilms = (slug, pageIndex = 1, pageLimit = 10) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.distributorFilms(slug, pageIndex, pageLimit),
		apiFetcher,
		{
			suspense: true,
		}
	);
};

/**
 * Get market share data for distributors.
 * @returns Market share data for distributors.
 * @example
 * const { data, error } = useDistributorMarketShare();
 */
export const useDistributorMarketShare = () => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.marketShare, apiFetcher, {
		suspense: true,
	});
};

/**
 * Get market share data for distributors for a year.
 * @param {number} year - Year to get market share data for.
 * @returns Market share data for distributors.
 * @example
 * const { data, error } = useDistributorMarketShareYear(2019);
 */
export const useDistributorMarketShareYear = (year) => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.marketShareYear(year), apiFetcher, {
		suspense: true,
	});
};
