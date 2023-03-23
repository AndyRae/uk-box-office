/**
 * @file Distributor API hooks.
 * @exports useDistributorList
 * @exports useDistributor
 * @exports useDistributorFilms
 * @exports useDistributorMarketShare
 * @exports useDistributorMarketShareYear
 */

import { getBackendURL } from './ApiFetcher';
import {
	Distributor,
	DistributorListData,
	DistributorFilmsData,
} from 'interfaces/Distributor';

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
	distributorList: (pageIndex: number, pageLimit: number) =>
		`${getBackendURL()}distributor/?page=${pageIndex}&limit=${pageLimit}`,
	distributorFilms: (slug: string, pageIndex: number, pageLimit: number) =>
		`${getBackendURL()}distributor/${slug}/films?page=${pageIndex}&limit=${pageLimit}`,
	distributor: (slug: string) => `${getBackendURL()}distributor/${slug}`,
};

/**
 * Get paginated list of all distributors.
 * @param {number} pageIndex - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of distributors from the api.
 * @example
 * const { data, error } = useDistributorList(1, 10);
 */
export const useDistributorList = async (
	pageIndex: number = 1,
	limit: number = 10
): Promise<DistributorListData> => {
	const res = await fetch(fetchKeys.distributorList(pageIndex, limit));
	return res.json();
};

/**
 * Get a single distributor.
 * @param {string} slug - Distributor slug.
 * @returns a single distributor from the api.
 * @example
 * const distributor = await getDistributor('warner-bros');
 */
export async function getDistributor(slug: string): Promise<Distributor> {
	const res = await fetch(fetchKeys.distributor(slug));
	return res.json();
}

/**
 * Get a single distributor films.
 * @param {string} slug - Distributor slug.
 * @param {number} pageIndex - Page number to start from.
 * @param {number} pageLimit - Number of items per page.
 * @returns a single distributor and its films from the api.
 * @example
 * const { data, error } = useDistributorFilms('mubi', 1, 10);
 */
export const useDistributorFilms = async (
	slug: string,
	pageIndex: number = 1,
	pageLimit: number = 10
): Promise<DistributorFilmsData> => {
	const res = await fetch(
		fetchKeys.distributorFilms(slug, pageIndex, pageLimit)
	);
	return res.json();
};
