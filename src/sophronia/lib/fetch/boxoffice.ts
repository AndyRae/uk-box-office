import { BoxOfficeWeek, BoxOfficeSummary } from 'interfaces/BoxOffice';
import { getApi } from './api';

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
	boxOfficeSummary: (start: number, end: number, limit: number) =>
		`${getApi()}/boxoffice/summary?start=${start}&end=${end}&limit=${limit}`,
	boxOfficePreviousYear: (start: number, end: number) =>
		`${getApi()}/boxoffice/previousyear?start=${start}&end=${end}`,
	boxOfficeTopFilms: () => `boxoffice/topfilms`,
	boxOfficeTopline: (start: number, end: number, limit: number) =>
		`boxoffice/topline?start=${start}&end=${end}&limit=${limit}`,
};

/**
 * Uses the box office summary endpoint with pagination
 * @param {string} startDate - Start date for the query.
 * @param {string} endDate - End date for the query.
 * @param {number} yearLimit - Number of years to limit.
 * @returns boxoffice summary data from the api with pagination.
 * @example
 * const { data, error } = fetchBoxOfficeSummary('2021-01-01', '2021-01-31', 5);
 */
export const fetchBoxOfficeSummary = async (
	startDate: string,
	endDate: string,
	yearLimit: number
): Promise<{ results: BoxOfficeSummary[] }> => {
	const res = await fetch(
		fetchKeys.boxOfficeSummary(startDate, endDate, yearLimit),
		{
			next: { revalidate: 60 },
		}
	);
	return res.json();
};

/**
 * Uses the box office ``previousyear`` endpoint
 * @param {string} start - Start date for the query.
 * @param {string} end - End date for the query.
 * @returns boxoffice previous year data from the api.
 * @example
 * const { data, error } = fetchBoxOfficePrevious('2021-01-01', '2021-01-31');
 */
export const fetchBoxOfficePreviousYear = async (
	start: string,
	end: string
): Promise<{ data?: { results: BoxOfficeSummary[] }; error?: any }> => {
	const res = await fetch(fetchKeys.boxOfficePreviousYear(start, end), {
		cache: 'no-store',
	});
	return res.json();
};

/**
 * Loops through the box office api infinitely and returns box office data.
 * @param {string} startDate - Start date for the query.
 * @param {string} endDate - End date for the query.
 * @returns boxoffice data from the api with pagination.
 * @example
 * const { data, error } = fetchBoxOfficeInfinite('2021-01-01', '2021-01-31');
 */
export async function fetchBoxOfficeInfinite(
	startDate: string,
	endDate: string
) {
	const backendUrl = `${getApi()}/boxoffice/all`;
	const allData: BoxOfficeWeek[] = [];

	let nextPage = 1;
	let isLastPage = false;
	let totalCount = 0;
	while (!isLastPage) {
		const response = await fetch(
			`${backendUrl}?start=${startDate}&end=${endDate}&page=${nextPage}`,
			{ cache: 'no-store' }
		);
		if (!response.ok) {
			throw new Error('Failed to fetch box office data');
		}
		const data = await response.json();
		allData.push(...data.results);
		totalCount = data.count;
		isLastPage = !data.next;
		nextPage++;
	}

	const isReachedEnd = allData.length === totalCount;
	const percentFetched = Math.round((allData.length / totalCount) * 100);

	return {
		results: allData,
		isReachedEnd,
		percentFetched,
	};
}
