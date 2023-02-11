/**
 * @file Boxoffice API endpoints.
 * @exports useBoxOffice
 * @exports useBoxOfficeFiltered
 * @exports useBoxOfficeTopFilms
 * @exports useBoxOfficeSummary
 * @exports useBoxOfficePrevious
 * @exports useBoxOfficePreviousYear
 * @exports useBoxOfficeTopline
 * @exports useBoxOfficeInfinite
 * @exports useProtectedSWRInfinite
 */

import {
	useBackendApi,
	useInfiniteFetcher,
	getBackendURLClient,
} from './ApiFetcher';
import useSWR from 'swr';
import useSWRInfinite, { SWRInfiniteResponse } from 'swr/infinite';
import { useMemo } from 'react';
import { useEffect } from 'react';
import { BoxOfficeListData, BoxOfficeWeek } from 'interfaces/BoxOffice';

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
const fetchKeys: any = {
	boxOffice: 'boxoffice/all',
	boxOfficeFiltered: (
		start: number,
		end: number,
		page: number,
		limit: number
	) => `boxoffice/all?{start=${start}}&end=${end}&page=${page}&limit=${limit}`,
	boxOfficeAll: (start: number, limit: number) =>
		`boxoffice/all?start=${start}&limit=${limit}`,
	boxOfficeSummary: (start: number, end: number, limit: number) =>
		`boxoffice/summary?start=${start}&end=${end}&limit=${limit}`,
	boxOfficePrevious: (start: number, end: number) =>
		`boxoffice/previous?start=${start}&end=${end}`,
	boxOfficePreviousYear: (start: number, end: number) =>
		`boxoffice/previousyear?start=${start}&end=${end}`,
	boxOfficeTopFilms: () => `boxoffice/topfilms`,
	boxOfficeTopline: (start: number, end: number, limit: number) =>
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
	startDate: string,
	endDate: string,
	start: number = 1,
	limit: number = 300
): { data?: BoxOfficeListData; error?: any } => {
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
export const useBoxOfficeTopFilms = (): any => {
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
export const useBoxOfficeSummary = (
	startDate: string,
	endDate: string,
	yearLimit: number
): any => {
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
export const useBoxOfficePrevious = (start: string, end: string): any => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.boxOfficePrevious(start, end), apiFetcher, {
		suspense: true,
	});
};

/**
 * Uses the box office ``previousyear`` endpoint
 * @param {string} start - Start date for the query.
 * @param {string} end - End date for the query.
 * @returns boxoffice previous year data from the api.
 * @example
 * const { data, error } = useBoxOfficePrevious('2021-01-01', '2021-01-31');
 */
export const useBoxOfficePreviousYear = (start: string, end: string): any => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.boxOfficePreviousYear(start, end), apiFetcher, {
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
export const useBoxOfficeTopline = (
	startDate: string,
	endDate: string,
	page: number
): any => {
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
export function useBoxOfficeInfinite(
	startDate: string,
	endDate: string
): {
	results: BoxOfficeWeek[];
	mutate: any;
	error: any;
	size: number;
	setSize: any;
	isReachedEnd: boolean;
	percentFetched: number;
} {
	const { data, mutate, error, size, setSize } = useProtectedSWRInfinite(
		startDate,
		endDate
	);

	useEffect(() => {
		if (data?.[data?.length - 1]?.next) {
			setSize((size: number) => size + 1);
		}
	}, [data, setSize]);

	// Concatenate all pages into one array.
	const results = useMemo(
		() => [].concat(...data.map((page: { results: any }) => page.results)),
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
const useProtectedSWRInfinite = (
	startDate: string,
	endDate: string
): SWRInfiniteResponse<BoxOfficeListData> => {
	const backendUrl = `${getBackendURLClient()}boxoffice/all`;

	/**
	 * Next page infinite loading for useSWR
	 * @param pageIndex The index of this paging collection
	 * @param previousPageData Previous page information
	 * @returns API to the next page
	 */
	function getNextKey(pageIndex: number, previousPageData: { next: any }) {
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
	return useSWRInfinite(getNextKey, useInfiniteFetcher, revalidationOptions);
};
