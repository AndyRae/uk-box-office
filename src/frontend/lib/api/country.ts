import {
	Country,
	CountryBoxOffice,
	CountryFilmsData,
	CountryListData,
} from '@/interfaces/Country';
import {
	getCountryBoxOfficeEndpoint,
	getCountryEndpoint,
	getCountryFilmsEndpoint,
	getCountryListEndpoint,
} from './endpoints';
import { getBoxOffice, get, list, getFilms } from '@/db/country';
import request from './request';
import { FilmSortOption } from '@/interfaces/Film';

/**
 * Countries
 */

/**
 * Get paginated list of countries.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of countrys from the api.
 * @example
 * const { data, error } = fetchCountryList(1, 10);
 */
export const fetchCountryList = async (
	page: number = 1,
	limit: number = 10
): Promise<CountryListData> => {
	if (process.env.USE_PRISMA) {
		try {
			const countries = await list(page, limit);
			if (list === null) {
				throw new Error();
			}
			return countries;
		} catch (error) {
			console.warn(error);
			return {
				count: 0,
				next: 0,
				previous: 0,
				results: [],
			};
		}
	}
	try {
		const url = getCountryListEndpoint(page, limit);
		return await request<CountryListData>(url, { next: { revalidate: 60 } });
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
 * Get a single country.
 * @param {string} slug - Country slug.
 * @returns a single country from the api.
 * @example
 * const country = await fetchCountry('united-kingdom');
 */
export async function fetchCountry(slug: string): Promise<Country | undefined> {
	if (process.env.USE_PRISMA) {
		try {
			const country = await get(slug);
			if (country === null) {
				throw new Error(`Country with slug '${slug}' not found.`);
			}
			return country;
		} catch (error) {
			console.warn(error);
			return;
		}
	}
	try {
		const url = getCountryEndpoint(slug);
		return await request<Country>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
}

/**
 * Get a single countries and its films paginated.
 * @param {string} slug - Country slug.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns a single country and its paginated films from the api.
 * @example
 * const { data, error } = fetchCountryFilms('uk', 1, 10);
 */
export const fetchCountryFilms = async (
	slug: string,
	page: number,
	limit: number,
	sort: FilmSortOption
): Promise<CountryFilmsData | undefined> => {
	if (process.env.USE_PRISMA) {
		try {
			const films = await getFilms(slug, page, limit, sort);
			if (films === null) {
				throw new Error(`Not found`);
			}
			return films;
		} catch (error) {
			console.warn(error);
			return;
		}
	}
	try {
		const url = getCountryFilmsEndpoint(slug, page, limit, sort);
		return await request<CountryFilmsData>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
};

/**
 * Get a single countries and its box office.
 * @param {string} slug - Country slug.
 * @param {number} limit - Years to go back.
 * @returns a single country and box office from the api.
 * @example
 * const data = fetchCountryBoxOffice('uk', 10);
 */
export const fetchCountryBoxOffice = async (
	slug: string,
	limit: number
): Promise<CountryBoxOffice | undefined> => {
	if (process.env.USE_PRISMA) {
		try {
			const results = await getBoxOffice(slug, limit);
			if (results === null) {
				throw new Error();
			}
			return results;
		} catch (error) {
			console.warn(error);
			return;
		}
	}
	try {
		const url = getCountryBoxOfficeEndpoint(slug, limit);
		return await request<CountryBoxOffice>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
};
