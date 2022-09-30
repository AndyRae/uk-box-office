import { useBackendApi } from './ApiFetcher';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useMemo } from 'react';
import axios from 'axios';

export const fetchKeys = {
	boxOffice: (start_date, end_date, start, limit) =>
		`boxoffice/all?start_date=${start_date}&end_date=${end_date}&=${start}&limit=${limit}`,
	boxOfficeAll: (start, limit) => `boxoffice/all?start=${start}&limit=${limit}`,
	boxOfficeTop: () => `boxoffice/top`,
	boxOfficeInfinite: (startDate, end_date, limit, index, previousPageData) => {
		// if (previousPageData.results && !previousPageData.results.length) return null;
		index += 1; // index is 0 by default
		return `boxoffice/all?start_date=${startDate}&end_date=${end_date}&start=${index}&limit=${limit}`;
	},
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
};

export const useBoxOfficeInfinite = (startDate, end_date, limit = 150) => {
	const apiFetcher = useBackendApi();

	const { data } = useSWRInfinite(
		(index, previousPageData) =>
			fetchKeys.boxOfficeInfinite(
				startDate,
				end_date,
				limit,
				index,
				previousPageData
			),
		apiFetcher,
		{
			suspense: true,
		}
	);
	const results = useMemo(
		() => [].concat(...data.map((page) => page.results)),
		[data]
	);
	console.log(results);
	return results;
};

export const useBoxOfficeTop = () => {
	const apiFetcher = useBackendApi();
	return useSWR(fetchKeys.boxOfficeTop(), apiFetcher, {
		suspense: true,
	});
};

// Common axios fetch function for use with useSWR
export async function fetcher1(url) {
	try {
		return (await axios.get(url)).data;
	} catch (err) {
		throw { status: err.response.status, message: err.response.data };
	}
}

/**
 * Paging with useSWRInfinite + protected token support
 * @param path Current query directory path
 * @returns useSWRInfinite API
 */
export function useProtectedSWRInfinite(startDate, endDate) {
	/**
	 * Next page infinite loading for useSWR
	 * @param pageIdx The index of this paging collection
	 * @param prevPageData Previous page information
	 * @param path Directory path
	 * @returns API to the next page
	 */
	const url = 'http://localhost:5000/api2/boxoffice/all';
	// const url = 'boxoffice/all';
	// const apiFetcher = useBackendApi();

	function getNextKey(pageIndex, previousPageData) {
		// Reached the end of the collection
		if (previousPageData && !previousPageData.next) return null;

		console.log(pageIndex);

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
	return useSWRInfinite(getNextKey, fetcher1, revalidationOptions);
}

/**
 * Deprecated.
 *
 */
export const useMagicLoop = async (startDate, endDate) => {
	const url = 'http://localhost:5000/api2/boxoffice/all';
	const baseUrl = `${url}?start_date=${startDate}&end_date=${endDate}&start=`;
	let page = 1;
	let results = [];
	let lastResult = [];
	do {
		// try catch to catch any errors in the async api call
		try {
			// use node-fetch to make api call
			const resp = await fetch(`${baseUrl}${page}`);
			const data = await resp.json();
			lastResult = data;
			data.results.forEach((week) => {
				// destructure the object and add to array
				const {
					date,
					film,
					film_slug,
					distributor,
					week_gross,
					number_of_cinemas,
					weeks_on_release,
				} = week;
				results.push({
					date,
					film,
					film_slug,
					distributor,
					week_gross,
					number_of_cinemas,
					weeks_on_release,
				});
			});
			// increment the page on each loop
			page += 1;
		} catch (err) {
			console.error(`Something is wrong ${err}`);
			break;
		}
		// keep running until there's no next page
	} while (lastResult.next !== '');

	return { results };
};
