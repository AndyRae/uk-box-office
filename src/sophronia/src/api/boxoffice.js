import { useBackendApi, useAxiosFetcher } from './ApiFetcher';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useMemo } from 'react';
import { useEffect } from 'react';

export const fetchKeys = {
	boxOffice: 'boxoffice/all',
	boxOfficeFiltered: (start_date, end_date, start, limit) =>
		`boxoffice/all?{start_date=${start_date}}&end_date=${end_date}&=${start}&limit=${limit}`,
	boxOfficeAll: (start, limit) => `boxoffice/all?start=${start}&limit=${limit}`,
	boxOfficeSummary: (startDate, endDate, limit) =>
		`boxoffice/summary?start_date=${startDate}&end_date=${endDate}&limit=${limit}`,
	boxOfficeTop: () => `boxoffice/top`,
	boxOfficeInfinite: (startDate, end_date, limit, index, previousPageData) => {
		index += 1; // index is 0 by default
		return `boxoffice/all?start_date=${startDate}&end_date=${end_date}&start=${index}&limit=${limit}`;
	},
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
	limit = 150
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

export const useBoxOfficeTop = () => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.boxOfficeTop(), apiFetcher, {
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

	return {
		results,
		mutate,
		error,
		size,
		setSize,
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
	const url = 'http://localhost:5000/api2/boxoffice/all';

	function getNextKey(pageIndex, previousPageData) {
		// Reached the end of the collection
		if (previousPageData && !previousPageData.next) return null;

		// First page with no prevPageData
		if (pageIndex === 0)
			return `${url}?start_date=${startDate}&end_date=${endDate}`;

		// Add nextPage token to API endpoint
		return [
			`${url}?start_date=${startDate}&end_date=${endDate}&start=${previousPageData.next}`,
		];
	}

	// Disable auto-revalidate, these options are equivalent to useSWRImmutable
	// https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
	const revalidationOptions = {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: true,
		suspense: true,
	};
	return useSWRInfinite(getNextKey, useAxiosFetcher, revalidationOptions);
};
