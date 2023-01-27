import { getBackendURL } from 'lib/ApiFetcher';

export async function getFilm(slug) {
	const url = getBackendURL();
	const res = await fetch(`${url}film/${slug}`);
	return res.json();
}
