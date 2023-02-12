import { getBackendURL } from 'lib/ApiFetcher';
import { Country } from 'interfaces/Country';

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
