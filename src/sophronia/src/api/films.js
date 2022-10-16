import { useBackendApi } from './ApiFetcher';
import useSWR from 'swr';

export const fetchKeys = {
	filmList: (pageIndex, limit) => `film/?page=${pageIndex}&limit=${limit}`,
	film: (slug) => `film/${slug}`,
};

/**
 * Get paginated list of films.
 */
export const useFilmList = (pageIndex = 1, limit = 10) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.filmList(pageIndex, limit),
		async (url) => {
			const data = await apiFetcher(url);
			return data;
		},
		{ suspense: true }
	);
};

/**
 * Get a single film.
 */
export const useFilm = (id) => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.film(id), apiFetcher, {
		suspense: true,
	});
};
