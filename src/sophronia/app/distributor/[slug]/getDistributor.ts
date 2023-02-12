import { getBackendURL } from 'lib/ApiFetcher';
import { Distributor } from 'interfaces/Distributor';

/**
 * Get a single distributor.
 * @param {string} slug - Distributor slug.
 * @returns a single distributor from the api.
 * @example
 * const distributor = await getDistributor('warner-bros');
 */
export async function getDistributor(slug: string): Promise<Distributor> {
	const url = getBackendURL();
	const res = await fetch(`${url}distributor/${slug}`);
	return res.json();
}
