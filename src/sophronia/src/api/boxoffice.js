import { useBackendApi, useAxiosFetcher } from './ApiFetcher';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useMemo } from 'react';
import { useEffect } from 'react';

export const fetchKeys = {
	boxOffice: 'boxoffice/all',
	boxOfficeFiltered: (start, end, page, limit) =>
		`boxoffice/all?{start=${start}}&end=${end}&page=${page}&limit=${limit}`,
	boxOfficeAll: (start, limit) => `boxoffice/all?start=${start}&limit=${limit}`,
	boxOfficeSummary: (start, end, limit) =>
		`boxoffice/summary?start=${start}&end=${end}&limit=${limit}`,
	boxOfficePrevious: (start, end) =>
		`boxoffice/previous?start=${start}&end=${end}`,
	boxOfficeTopFilms: () => `boxoffice/topfilms`,
	boxOfficeTopline: (start, end, limit) =>
		`boxoffice/topline?start=${start}&end=${end}&limit=${limit}`,
};

/**
 * Get boxoffice.
 */
export const useBoxOffice = () => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.boxOffice, apiFetcher, {
		suspense: true,
	});
};

/**
 * Get boxoffice.
 */
export const useBoxOfficeFiltered = (
	start_date,
	end_date,
	start = 1,
	limit = 300
) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.boxOfficeFiltered(start_date, end_date, start, limit),
		apiFetcher,
		{
			suspense: true,
		}
	);
};

/**
 * Endpoint for top films all time.
 * @returns all time top films.
 */
export const useBoxOfficeTopFilms = () => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.boxOfficeTopFilms(), apiFetcher, {
		suspense: true,
	});
};

/**
 * Uses the box office summary endpoint
 * @param {*} startDate
 * @param {*} endDate
 * @returns
 */
export const useBoxOfficeSummary = (startDate, endDate, limit) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.boxOfficeSummary(startDate, endDate, limit),
		apiFetcher,
		{
			suspense: true,
		}
	);
};

/**
 * Uses the box office previous endpoint
 * @param {*} start
 * @param {*} end
 * @returns
 */
export const useBoxOfficePrevious = (start, end) => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.boxOfficePrevious(start, end), apiFetcher, {
		suspense: true,
	});
};

/**
 * Uses the box office summary endpoint
 * @param {*} startDate
 * @param {*} endDate
 * @returns
 */
export const useBoxOfficeTopline = (startDate, endDate, limit) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.boxOfficeTopline(startDate, endDate, limit),
		apiFetcher,
		{
			suspense: true,
		}
	);
};

/**
 * Loops through the box office api infinitely and returns the data
 * @param startDate date to query from
 * @param endDate date to query to
 * @returns boxoffice data
 */
export function useBoxOfficeInfinite(startDate, endDate) {
	const { data, mutate, error, size, setSize } = useProtectedSWRInfinite(
		startDate,
		endDate
	);

	useEffect(() => {
		if (data?.[data?.length - 1]?.next) {
			setSize((size) => size + 1);
		}
	}, [data, setSize]);

	// Concatenate all pages into one array.
	const results = useMemo(
		() => [].concat(...data.map((page) => page.results)),
		[data]
	);

	const isReachedEnd = results.length === data[0].count;

	return {
		results,
		mutate,
		error,
		size,
		setSize,
		isReachedEnd,
	};
}

/**
 * Paging with useSWRInfinite
 * @param startDate
 * @param endDate
 * @returns useSWRInfinite API
 */
const useProtectedSWRInfinite = (startDate, endDate) => {
	/**
	 * Next page infinite loading for useSWR
	 * @param pageIdx The index of this paging collection
	 * @param prevPageData Previous page information
	 * @returns API to the next page
	 */

	const getBackendURL = () => {
		return `${process.env.BACKEND_URL || 'http://localhost:5000/api/'}`;
	};

	const backendUrl = `${getBackendURL()}boxoffice/all`;

	function getNextKey(pageIndex, previousPageData) {
		// Reached the end of the collection
		if (previousPageData && !previousPageData.next) return null;

		// First page with no prevPageData
		if (pageIndex === 0)
			return `${backendUrl}?start=${startDate}&end=${endDate}`;

		// Add nextPage token to API endpoint
		return [
			`${backendUrl}?start=${startDate}&end=${endDate}&page=${previousPageData.next}`,
		];
	}

	// Disable auto-revalidate, these options are equivalent to useSWRImmutable
	// https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
	const revalidationOptions = {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateFirstPage: false,
		revalidateOnReconnect: true,
		suspense: true,
	};
	return useSWRInfinite(getNextKey, useAxiosFetcher, revalidationOptions);
};
