/**
 * @file Boxoffice API endpoints.
 * @exports useBoxOffice
 * @exports useBoxOfficeFiltered
 * @exports useBoxOfficeTopFilms
 * @exports useBoxOfficeSummary
 * @exports useBoxOfficePrevious
 * @exports useBoxOfficeTopline
 * @exports useBoxOfficeInfinite
 * @exports useProtectedSWRInfinite
 */

import {
	useBackendApi,
	useAxiosFetcher,
	getBackendURLClient,
} from './ApiFetcher';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useMemo } from 'react';
import { useEffect } from 'react';
import { getBackendURL } from './ApiFetcher';

/**
 * Fetch keys for boxoffice.
 * @type {Object}
 * @property {string} boxOffice - Boxoffice endpoint.
 * @property {function} boxOfficeFiltered - Boxoffice endpoint with filters.
 * @property {function} boxOfficeAll - Boxoffice endpoint with filters.
 * @property {function} boxOfficeSummary - Boxoffice summary endpoint.
 * @property {function} boxOfficePrevious - Boxoffice previous endpoint.
 * @property {function} boxOfficeTopFilms - Boxoffice top films endpoint.
 * @property {function} boxOfficeTopline - Boxoffice topline endpoint.
 */
const fetchKeys = {
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
 * Get all boxoffice data.
 * @returns all boxoffice data from the api with pagination.
 */
export const useBoxOffice = () => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.boxOffice, apiFetcher, {
		suspense: true,
	});
};

/**
 * Get filtered boxoffice data with pagination.
 * @param {string} startDate - Start date for the query.
 * @param {string} endDate - End date for the query.
 * @param {number} start - Page number to start from.
 * @param {number} limit - Number of results per page.
 * @returns filtered boxoffice data from the api with pagination.
 * @example
 * const { data, error } = useBoxOfficeFiltered('2021-01-01', '2021-01-31', 1, 300);
 */
export const useBoxOfficeFiltered = (
	startDate,
	endDate,
	start = 1,
	limit = 300
) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.boxOfficeFiltered(startDate, endDate, start, limit),
		apiFetcher,
		{
			suspense: true,
		}
	);
};

/**
 * Get top films boxoffice data.
 * @returns top films boxoffice data from the api.
 * @example
 * const { data, error } = useBoxOfficeTopFilms();
 */
export const useBoxOfficeTopFilms = () => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.boxOfficeTopFilms(), apiFetcher, {
		suspense: true,
	});
};

/**
 * Uses the box office summary endpoint with pagination
 * @param {string} startDate - Start date for the query.
 * @param {string} endDate - End date for the query.
 * @param {number} yearLimit - Number of years to limit.
 * @returns boxoffice summary data from the api with pagination.
 * @example
 * const { data, error } = useBoxOfficeSummary('2021-01-01', '2021-01-31', 5);
 */
export const useBoxOfficeSummary = (startDate, endDate, yearLimit) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.boxOfficeSummary(startDate, endDate, yearLimit),
		apiFetcher,
		{
			suspense: true,
		}
	);
};

/**
 * Uses the box office ``previous`` endpoint
 * @param {string} start - Start date for the query.
 * @param {string} end - End date for the query.
 * @returns boxoffice previous data from the api.
 * @example
 * const { data, error } = useBoxOfficePrevious('2021-01-01', '2021-01-31');
 */
export const useBoxOfficePrevious = (start, end) => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.boxOfficePrevious(start, end), apiFetcher, {
		suspense: true,
	});
};

/**
 * Uses the box office topline endpoint.
 * @param {string} startDate - Start date for the query.
 * @param {string} endDate - End date for the query.
 * @param {number} page - Page number to start from.
 * @returns boxoffice topline data from the api.
 * @example
 * const { data, error } = useBoxOfficeTopline('2021-01-01', '2021-01-31', 1);
 */
export const useBoxOfficeTopline = (startDate, endDate, page) => {
	const apiFetcher = useBackendApi();
	return useSWR(
		fetchKeys.boxOfficeTopline(startDate, endDate, page),
		apiFetcher,
		{
			suspense: true,
		}
	);
};

/**
 * Wrapper for useSWRInfinite that uses the protected api.
 * Loops through the box office api infinitely and returns box office data.
 * @param {string} startDate - Start date for the query.
 * @param {string} endDate - End date for the query.
 * @returns boxoffice data from the api with pagination.
 * @example
 * const { data, error } = useBoxOfficeInfinite('2021-01-01', '2021-01-31');
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
	const percentFetched = Math.round((results.length / data[0].count) * 100);

	return {
		results,
		mutate,
		error,
		size,
		setSize,
		isReachedEnd,
		percentFetched,
	};
}

/**
 * Protected useSWRInfinite hook that uses the protected api.
 * @param {string} startDate - Start date for the query.
 * @param {string} endDate - End date for the query.
 * @returns useSWR hook with boxoffice data from the api with pagination.
 */
const useProtectedSWRInfinite = (startDate, endDate) => {
	const backendUrl = `${getBackendURLClient()}boxoffice/all`;

	/**
	 * Next page infinite loading for useSWR
	 * @param pageIndex The index of this paging collection
	 * @param previousPageData Previous page information
	 * @returns API to the next page
	 */
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
