/**
 * @file Country API endpoints.
 * This file contains all the api calls for the countries resource.
 * @exports useCountryList
 * @exports useCountry
 * @exports useCountryFilms
 */

import { getBackendURL } from './ApiFetcher';
import { Country, CountryListData, CountryFilmsData } from 'interfaces/Country';

/**
 * Fetch keys for countries.
 * @type {Object}
 * @property {function} countryList - Country list endpoint.
 * @property {function} countryFilms - Country films endpoint.
 * @property {function} country - Country endpoint.
 */
export const fetchKeys: any = {
	countryList: (pageIndex: number, limit: number) =>
		`${getBackendURL()}country/?page=${pageIndex}&limit=${limit}`,
	countryFilms: (slug: string, pageIndex: number, pageLimit: number) =>
		`${getBackendURL()}country/${slug}/films?page=${pageIndex}&limit=${pageLimit}`,
	country: (slug: string) => `${getBackendURL()}country/${slug}`,
};

/**
 * Get paginated list of countrys.
 * @param {number} pageIndex - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of countrys from the api.
 * @example
 * const { data, error } = useCountryList(1, 10);
 */
export const useCountryList = async (
	pageIndex: number = 1,
	limit: number = 10
): Promise<CountryListData> => {
	const res = await fetch(fetchKeys.countryList(pageIndex, limit));
	return res.json();
};

/**
 * Get a single country.
 * @param {string} slug - Country slug.
 * @returns a single country from the api.
 * @example
 * const country = await getCountry('united-kingdom');
 */
export async function getCountry(slug: string): Promise<Country> {
	const url = getBackendURL();
	const res = await fetch(`${url}country/${slug}`);
	return res.json();
}

/**
 * Get a single countries and its films paginated.
 * @param {string} slug - Country slug.
 * @param {number} pageIndex - Page number to start from.
 * @param {number} pageLimit - Number of items per page.
 * @returns a single country and its paginated films from the api.
 * @example
 * const { data, error } = useCountryFilms('uk', 1, 10);
 */
export const useCountryFilms = async (
	slug: string,
	pageIndex: number,
	pageLimit: number
): Promise<CountryFilmsData> => {
	const res = await fetch(fetchKeys.countryFilms(slug, pageIndex, pageLimit));
	return res.json();
};
