import request from './request';
import {
	Distributor,
	DistributorBoxOffice,
	DistributorFilmsData,
	DistributorListData,
} from '@/interfaces/Distributor';
import {
	getDistributorBoxOfficeEndpoint as fetchDistributorBoxOfficeEndpoint,
	getDistributorEndpoint,
	getDistributorFilmsEndpoint,
	getDistributorListEndpoint,
} from './endpoints';
import { FilmSortOption } from '@/interfaces/Film';

/**
 * Distributors
 */
/**
 * Get paginated list of all distributors.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of distributors from the api.
 * @example
 * const data = await fetchDistributors(1, 10);
 */
export const fetchDistributors = async (
	page: number = 1,
	limit: number = 10
): Promise<DistributorListData> => {
	try {
		const url = getDistributorListEndpoint(page, limit);
		return await request<DistributorListData>(url, {
			next: { revalidate: 60 },
		});
	} catch (error) {
		console.warn(error);
		return {
			count: 0,
			next: 0,
			previous: 0,
			results: [],
		};
	}
};

/**
 * Get a single distributor.
 * @param {string} slug - Distributor slug.
 * @returns a single distributor from the api.
 * @example
 * const distributor = await fetchDistributor('warner-bros');
 */
export async function fetchDistributor(
	slug: string
): Promise<Distributor | undefined> {
	try {
		const url = getDistributorEndpoint(slug);
		return await request<Distributor>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
}

/**
 * Gets a distributor box office grouped by year
 * @param {string} slug - Distributor slug.
 * @param {number} limit - Years to go back .
 * @returns a distributors box office grouped by year
 * @example
 * const distributor = await fetchDistributorBoxOffice('warner-bros');
 */
export async function fetchDistributorBoxOffice(
	slug: string,
	limit: number = 25
): Promise<DistributorBoxOffice | undefined> {
	try {
		const url = fetchDistributorBoxOfficeEndpoint(slug, limit);
		return await request<DistributorBoxOffice>(url, {
			next: { revalidate: 60 },
		});
	} catch (error) {
		console.warn(error);
		return;
	}
}

/**
 * Get a single distributor films.
 * @param {string} slug - Distributor slug.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns a single distributor and its films from the api.
 * @example
 * const data = fetchDistributorFilms('mubi', 1, 10);
 */
export const fetchDistributorFilms = async (
	slug: string,
	page: number = 1,
	limit: number = 10,
	sort: FilmSortOption
): Promise<DistributorFilmsData | undefined> => {
	try {
		const url = getDistributorFilmsEndpoint(slug, page, limit, sort);
		return await request<DistributorFilmsData>(url, {
			next: { revalidate: 60 },
		});
	} catch (error) {
		console.warn(error);
		return;
	}
};
