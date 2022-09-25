import { useBackendApi } from './ApiFetcher';
import useSWR from 'swr';

export const fetchKeys = {
	boxOffice: (start_date, end_date, start, limit) =>
		`boxoffice/all?start_date=${start_date}&end_date=${end_date}&=${start}&limit=${limit}`,
	boxOfficeAll: (start, limit) => `boxoffice/all?start=${start}&limit=${limit}`,
	boxOfficeTop: () => `boxoffice/top`,
};

/**
 * Get boxoffice.
 */
export const useBoxOffice = (start_date, end_date, start = 1, limit = 150) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.boxOffice(start_date, end_date, start, limit),
		apiFetcher,
		{
			suspense: true,
		}
	);
	// return useSWR(fetchKeys.boxOfficeAll(start, limit), apiFetcher, {
	//   suspense: true,
	// });
};

export const useBoxOfficeTop = () => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.boxOfficeTop(), apiFetcher, {
		suspense: true,
	});
};
