import { getBackendURL } from 'lib/ApiFetcher';

export async function getDistributor(slug) {
	const url = getBackendURL();
	const res = await fetch(`${url}distributor/${slug}`);
	return res.json();
}
