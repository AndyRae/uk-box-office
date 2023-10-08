import request from './request';
import {
	BoxOfficeSummary,
	BoxOfficeWeek,
	Topline,
} from '@/interfaces/BoxOffice';
import {
	getApi,
	getBoxOfficeLastWeekEndpoint,
	getBoxOfficePreviousYearEndpoint,
	getBoxOfficeSummaryEndpoint,
	getBoxOfficeTopFilmsEndpoint,
	getCountryBoxOfficeEndpoint,
	getCountryEndpoint,
	getCountryFilmsEndpoint,
	getCountryListEndpoint,
	getDistributorBoxOfficeEndpoint as fetchDistributorBoxOfficeEndpoint,
	getDistributorEndpoint,
	getDistributorFilmsEndpoint,
	getDistributorListEndpoint,
	getDistributorMarketShareEndpoint,
	getEventsEndpoint,
	getFilmIdEndpoint,
	getFilmListEndpoint,
	getFilmSlugEndpoint,
	getForecastEndpoint,
	getSearchEndpoint,
	getSearchFilmEndpoint,
	getBoxOfficeInfiniteEndpoint,
} from './endpoints';
import {
	FilmWithWeeks,
	FilmListData,
	FilmOption,
	TopFilm,
	FilmSortOption,
} from '@/interfaces/Film';
import {
	Distributor,
	DistributorBoxOffice,
	DistributorFilmsData,
	DistributorListData,
} from '@/interfaces/Distributor';
import {
	Country,
	CountryBoxOffice,
	CountryFilmsData,
	CountryListData,
} from '@/interfaces/Country';
import { SearchParams, SearchResults } from '@/interfaces/Search';
import MarketShare from '@/interfaces/MarketShare';
import { StatusEvent } from '@/interfaces/Event';

/**
 * Box Office
 */
/**
 * Uses the box office summary endpoint with pagination
 * @param {string} start - Start date for the query.
 * @param {string} end - End date for the query.
 * @param {number} yearLimit - Number of years to limit.
 * @returns boxoffice summary data from the api with pagination.
 * @example
 * const data = fetchBoxOfficeSummary('2021-01-01', '2021-01-31', 5);
 */
export const fetchBoxOfficeSummary = async (
	start: string,
	end: string,
	yearLimit: number
): Promise<{ results: BoxOfficeSummary[] }> => {
	try {
		const url = getBoxOfficeSummaryEndpoint(start, end, yearLimit);
		return await request<{ results: BoxOfficeSummary[] }>(url, {
			next: { revalidate: 60 },
		});
	} catch (error) {
		console.warn(error);
		return { results: [] };
	}
};

/**
 * Uses the box office ``previousyear`` endpoint
 * @param {string} start - Start date for the query.
 * @param {string} end - End date for the query.
 * @returns boxoffice previous year data from the api.
 * @example
 * const data = fetchBoxOfficePrevious('2021-01-01', '2021-01-31');
 */
export const fetchBoxOfficePreviousYear = async (
	start: string,
	end: string
): Promise<{ results: BoxOfficeSummary[] }> => {
	try {
		const url = getBoxOfficePreviousYearEndpoint(start, end);
		return await request<{ results: BoxOfficeSummary[] }>(url, {
			cache: 'no-store',
		});
	} catch (error) {
		console.warn(error);
		return { results: [] };
	}
};

/**
 * Get the top films from the backend
 * @returns {Promise<{ results: TopFilm[] }>}
 */
export const fetchBoxOfficeTopFilms = async (): Promise<{
	results: TopFilm[];
}> => {
	try {
		const url = getBoxOfficeTopFilmsEndpoint();
		return await request<{ results: TopFilm[] }>(url, {
			next: { revalidate: 60 },
		});
	} catch (error) {
		console.warn(error);
		return { results: [] };
	}
};

/**
 * Fetches last week box office data.
 * @returns
 */
export async function fetchLastWeek(): Promise<{
	results: { date: string }[];
}> {
	try {
		const url = getBoxOfficeLastWeekEndpoint();
		return await request<{ results: { date: string }[] }>(url, {
			cache: 'no-store',
		});
	} catch (error) {
		console.warn(error);
		return { results: [] };
	}
}

/**
 * Loops through the box office api infinitely and returns box office data.
 * @param {string} startDate - Start date for the query.
 * @param {string} endDate - End date for the query.
 * @param {number[]} distributorId - List of distributor ids to filter by.
 * @param {number[]} countryId - List of country ids to filter by.
 * @returns boxoffice data from the api with pagination.
 * @example
 * const { data, error } = fetchBoxOfficeInfinite('2021-01-01', '2021-01-31', [1,11], [2,13]);
 */
export async function fetchBoxOfficeInfinite(
	startDate: string,
	endDate: string,
	distributorId?: number[],
	countryIds?: number[]
) {
	const backendUrl = getBoxOfficeInfiniteEndpoint();
	const allData: BoxOfficeWeek[] = [];

	let nextPage = 1;
	let isLastPage = false;
	let totalCount = 0;
	while (!isLastPage) {
		let url = `${backendUrl}?start=${startDate}&end=${endDate}&page=${nextPage}`;
		if (distributorId) {
			url += `&distributor=${distributorId}`;
		}
		if (countryIds) {
			url += `&country=${countryIds.join(',')}`;
		}
		const data = await request<{
			results: BoxOfficeWeek[];
			count: number;
			next: string | null;
		}>(url, { cache: 'no-store' });
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

/**
 * Films
 */
/**
 * Get paginated list of all films.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @param {string} sort - Field and method to sort by.
 * @returns paginated list of films from the api.
 * @example
 * const data = await fetchFilmList(1, 10, desc_name);
 */
export const fetchFilmList = async (
	page: number = 1,
	limit: number = 10,
	sort: FilmSortOption = 'asc_name'
): Promise<FilmListData> => {
	try {
		const url = getFilmListEndpoint(page, limit, sort);
		return await request<FilmListData>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return {
			count: 0,
			next: 0,
			previous: 0,
			results: [],
		};
	}
};

/**
 * Get a single film by slug
 * @param {string} slug - Film slug.
 * @returns a single film from the api.
 * @example
 * const film = await fetchFilm('the-dark-knight');
 */
export async function fetchFilm(
	slug: string
): Promise<FilmWithWeeks | undefined> {
	try {
		const url = getFilmSlugEndpoint(slug);
		return await request<FilmWithWeeks>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
}

/**
 * Get a single film by Id
 * @param {string} id - Film id.
 * @returns a single film from the api.
 * @example
 * const film = await fetchFilmId(100);
 */
export async function fetchFilmId(
	id: number
): Promise<FilmWithWeeks | undefined> {
	try {
		const url = getFilmIdEndpoint(id);
		return await request<FilmWithWeeks>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
}

/**
 * Distributors
 */
/**
 * Get paginated list of all distributors.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of distributors from the api.
 * @example
 * const data = await fetchDistributors(1, 10);
 */
export const fetchDistributors = async (
	page: number = 1,
	limit: number = 10
): Promise<DistributorListData> => {
	try {
		const url = getDistributorListEndpoint(page, limit);
		return await request<DistributorListData>(url, {
			next: { revalidate: 60 },
		});
	} catch (error) {
		console.warn(error);
		return {
			count: 0,
			next: 0,
			previous: 0,
			results: [],
		};
	}
};

/**
 * Get a single distributor.
 * @param {string} slug - Distributor slug.
 * @returns a single distributor from the api.
 * @example
 * const distributor = await fetchDistributor('warner-bros');
 */
export async function fetchDistributor(
	slug: string
): Promise<Distributor | undefined> {
	try {
		const url = getDistributorEndpoint(slug);
		return await request<Distributor>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
}

/**
 * Gets a distributor box office grouped by year
 * @param {string} slug - Distributor slug.
 * @param {number} limit - Years to go back .
 * @returns a distributors box office grouped by year
 * @example
 * const distributor = await fetchDistributorBoxOffice('warner-bros');
 */
export async function fetchDistributorBoxOffice(
	slug: string,
	limit: number = 25
): Promise<DistributorBoxOffice | undefined> {
	try {
		const url = fetchDistributorBoxOfficeEndpoint(slug, limit);
		return await request<DistributorBoxOffice>(url, {
			next: { revalidate: 60 },
		});
	} catch (error) {
		console.warn(error);
		return;
	}
}

/**
 * Get a single distributor films.
 * @param {string} slug - Distributor slug.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns a single distributor and its films from the api.
 * @example
 * const data = fetchDistributorFilms('mubi', 1, 10);
 */
export const fetchDistributorFilms = async (
	slug: string,
	page: number = 1,
	limit: number = 10,
	sort: FilmSortOption
): Promise<DistributorFilmsData | undefined> => {
	try {
		const url = getDistributorFilmsEndpoint(slug, page, limit, sort);
		return await request<DistributorFilmsData>(url, {
			next: { revalidate: 60 },
		});
	} catch (error) {
		console.warn(error);
		return;
	}
};

type MarketShareData = {
	results: MarketShare[];
};

/**
 * Get market share data from the backend.
 * @returns {Promise<MarketShareData>}
 */
export async function fetchMarketshare(): Promise<MarketShareData | undefined> {
	try {
		const url = getDistributorMarketShareEndpoint();
		return await request<MarketShareData>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
}

/**
 * Countries
 */

/**
 * Get paginated list of countries.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of countrys from the api.
 * @example
 * const { data, error } = fetchCountryList(1, 10);
 */
export const fetchCountryList = async (
	page: number = 1,
	limit: number = 10
): Promise<CountryListData> => {
	try {
		const url = getCountryListEndpoint(page, limit);
		return await request<CountryListData>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return {
			count: 0,
			next: 0,
			previous: 0,
			results: [],
		};
	}
};

/**
 * Get a single country.
 * @param {string} slug - Country slug.
 * @returns a single country from the api.
 * @example
 * const country = await fetchCountry('united-kingdom');
 */
export async function fetchCountry(slug: string): Promise<Country | undefined> {
	try {
		const url = getCountryEndpoint(slug);
		return await request<Country>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
}

/**
 * Get a single countries and its films paginated.
 * @param {string} slug - Country slug.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns a single country and its paginated films from the api.
 * @example
 * const { data, error } = fetchCountryFilms('uk', 1, 10);
 */
export const fetchCountryFilms = async (
	slug: string,
	page: number,
	limit: number,
	sort: FilmSortOption
): Promise<CountryFilmsData | undefined> => {
	try {
		const url = getCountryFilmsEndpoint(slug, page, limit, sort);
		return await request<CountryFilmsData>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
};

/**
 * Get a single countries and its box office.
 * @param {string} slug - Country slug.
 * @param {number} limit - Years to go back.
 * @returns a single country and box office from the api.
 * @example
 * const data = fetchCountryBoxOffice('uk', 10);
 */
export const fetchCountryBoxOffice = async (
	slug: string,
	limit: number
): Promise<CountryBoxOffice | undefined> => {
	try {
		const url = getCountryBoxOfficeEndpoint(slug, limit);
		return await request<CountryBoxOffice>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
};

/**
 * Search
 */
/**
 * Search for films, distributors, and countries.
 * @param {string} query - Search query.
 * @returns search results from the api.
 * @example
 * const { data, error } = fetchSearch('uk');
 */
export const fetchSearch = async (
	searchParams: SearchParams
): Promise<SearchResults | undefined> => {
	const {
		q,
		distributor,
		country,
		min_box: minBox,
		max_box: maxBox,
		min_year: minYear,
		max_year: maxYear,
		p: page,
		sort: sort,
	} = searchParams;
	const urlSearchParams = new URLSearchParams();

	// Add query parameter
	urlSearchParams.append('q', q);

	// Add parameters if provided
	distributor && urlSearchParams.append('distributor', distributor);
	country && urlSearchParams.append('country', country);
	minBox && urlSearchParams.append('min_box', minBox);
	maxBox && urlSearchParams.append('max_box', maxBox);
	minYear && urlSearchParams.append('min_year', minYear);
	maxYear && urlSearchParams.append('max_year', maxYear);
	page && urlSearchParams.append('p', page);
	sort && urlSearchParams.append('sort', sort);

	try {
		const url = getSearchEndpoint(urlSearchParams.toString());
		return await request<SearchResults>(url, { cache: 'no-store' });
	} catch (error) {
		console.warn(error);
		return;
	}
};

// Make the options search request
export async function fetchSearchFilms(
	term: string
): Promise<FilmOption[] | undefined> {
	try {
		const url = getSearchFilmEndpoint(term);
		return await request<FilmOption[]>(url, { cache: 'no-store' });
	} catch (error) {
		console.warn(error);
		return;
	}
}

/**
 * Forecast
 */

type ForecastData = {
	results: Topline[];
};

/**
 * Get the forecast data from the backend
 * @param {string} start
 * @param {string} end
 * @param {number} limit
 * @returns {Promise<ForecastData>}
 * @example
 * const data = await fetchForecast();
 */
export async function fetchForecast(
	start: string,
	end: string,
	limit: number = 10
): Promise<ForecastData | undefined> {
	try {
		const url = getForecastEndpoint(start, end, limit);
		return await request<ForecastData>(url, { next: { revalidate: 60 } });
	} catch (error) {
		console.warn(error);
		return;
	}
}

/**
 * Events
 */

type EventsOverview = {
	Archive: StatusEvent;
	ETL: StatusEvent;
	Forecast: StatusEvent;
	latest: {
		count: number;
		next: string;
		previous: string;
		results: StatusEvent[];
	};
};

/**
 * Get the events overview.
 * @returns the events overview from the api.
 * @example
 * const events = await fetchEvents());
 */
export async function fetchStatusEvents(): Promise<EventsOverview | undefined> {
	try {
		const url = getEventsEndpoint();
		return await request<EventsOverview>(url, { next: { revalidate: 0 } });
	} catch (error) {
		console.warn(error);
		return;
	}
}
