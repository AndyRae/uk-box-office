import { getBackendURL } from 'lib/ApiFetcher';

export async function getCountry(slug) {
	const url = getBackendURL();
	const res = await fetch(`${url}country/${slug}`, { cache: 'no-store' });
	return res.json();
}
