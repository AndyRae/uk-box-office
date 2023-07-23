import { BoxOfficeSummary, BoxOfficeWeek, Topline } from 'interfaces/BoxOffice';
import request from './request';
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
	getDistributorBoxOfficeEndpoint,
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
} from './endpoints';
import {
	FilmWithWeeks,
	FilmListData,
	FilmOption,
	TopFilm,
} from 'interfaces/Film';
import {
	Distributor,
	DistributorBoxOffice,
	DistributorFilmsData,
	DistributorListData,
} from 'interfaces/Distributor';
import {
	Country,
	CountryBoxOffice,
	CountryFilmsData,
	CountryListData,
} from 'interfaces/Country';
import { SearchParams, SearchResults } from 'interfaces/Search';
import MarketShare from '../interfaces/MarketShare';
import { StatusEvent } from '../interfaces/Event';

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
 * const { data, error } = fetchBoxOfficeSummary('2021-01-01', '2021-01-31', 5);
 */
export const fetchBoxOfficeSummary = async (
	start: string,
	end: string,
	yearLimit: number
): Promise<BoxOfficeSummary[]> => {
	try {
		const url = getBoxOfficeSummaryEndpoint(start, end, yearLimit);
		return await request<BoxOfficeSummary[]>(url);
	} catch (error) {
		throw new Error('Failed to fetch box office summary');
	}
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
): Promise<{ results: BoxOfficeSummary[] }> => {
	try {
		const url = getBoxOfficePreviousYearEndpoint(start, end);
		const data = await request<BoxOfficeSummary[]>(url);
		return {
			results: data,
		};
	} catch (error) {
		throw new Error('Failed to fetch box office summary');
	}
};

/**
 * Get the top films from the backend
 * @returns {Promise<{ results: TopFilm[] }>}
 */
export const fetchBoxOfficeTopFilms = async (): Promise<TopFilm[]> => {
	try {
		const url = getBoxOfficeTopFilmsEndpoint();
		return await request<TopFilm[]>(url);
	} catch (error) {
		throw new Error('Failed to fetch box office summary');
	}
};

/**
 * Fetches last week box office data.
 * @returns
 */
export async function getLastWeek(): Promise<{ results: { date: string }[] }> {
	try {
		const url = getBoxOfficeLastWeekEndpoint();
		return await request<{ results: { date: string }[] }>(url);
	} catch (error) {
		throw new Error('Failed to fetch box office summary');
	}
}

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
	endDate: string,
	distributorId?: number,
	countryIds?: number[]
) {
	const backendUrl = `${getApi()}/boxoffice/all`;
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
		const response = await fetch(url, { cache: 'no-store' });
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

/**
 * Films
 */
/**
 * Get paginated list of all films.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of films from the api.
 * @example
 * const { data, error } = useFilmList(1, 10);
 */
export const useFilmList = async (
	page: number = 1,
	limit: number = 10
): Promise<FilmListData> => {
	try {
		const url = getFilmListEndpoint(page, limit);
		return await request<FilmListData>(url);
	} catch (error) {
		throw new Error('Failed to film');
	}
};

/**
 * Get a single film.
 * @param {string} slug - Film slug.
 * @returns a single film from the api.
 * @example
 * const film = await getFilm('the-dark-knight');
 */
export async function getFilm(slug: string): Promise<FilmWithWeeks> {
	try {
		const url = getFilmSlugEndpoint(slug);
		return await request<FilmWithWeeks>(url);
	} catch (error) {
		throw new Error('Failed to film');
	}
}

/**
 * Get a single film.
 * @param {string} id - Film id.
 * @returns a single film from the api.
 * @example
 * const film = await getFilm(100);
 */
export async function getFilmId(id: number): Promise<FilmWithWeeks> {
	try {
		const url = getFilmIdEndpoint(id);
		return await request<FilmWithWeeks>(url);
	} catch (error) {
		throw new Error('Failed to film');
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
 * const { data, error } = useDistributorList(1, 10);
 */
export const useDistributorList = async (
	page: number = 1,
	limit: number = 10
): Promise<DistributorListData> => {
	try {
		const url = getDistributorListEndpoint(page, limit);
		return await request<DistributorListData>(url);
	} catch (error) {
		throw new Error('Failed to distributor');
	}
};

/**
 * Get a single distributor.
 * @param {string} slug - Distributor slug.
 * @returns a single distributor from the api.
 * @example
 * const distributor = await getDistributor('warner-bros');
 */
export async function getDistributor(slug: string): Promise<Distributor> {
	try {
		const url = getDistributorEndpoint(slug);
		return await request<Distributor>(url);
	} catch (error) {
		throw new Error('Failed to distributor');
	}
}

/**
 * Gets a distributor box office grouped by year
 * @param {string} slug - Distributor slug.
 * @param {number} limit - Years to go back .
 * @returns a distributors box office grouped by year
 * @example
 * const distributor = await getDistributorBoxOffice('warner-bros');
 */
export async function getDistributorBoxOffice(
	slug: string,
	limit: number = 25
): Promise<DistributorBoxOffice> {
	try {
		const url = getDistributorBoxOfficeEndpoint(slug, limit);
		return await request<DistributorBoxOffice>(url);
	} catch (error) {
		throw new Error('Failed to distributor');
	}
}

/**
 * Get a single distributor films.
 * @param {string} slug - Distributor slug.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns a single distributor and its films from the api.
 * @example
 * const { data, error } = useDistributorFilms('mubi', 1, 10);
 */
export const useDistributorFilms = async (
	slug: string,
	page: number = 1,
	limit: number = 10
): Promise<DistributorFilmsData> => {
	try {
		const url = getDistributorFilmsEndpoint(slug, page, limit);
		return await request<DistributorFilmsData>(url);
	} catch (error) {
		throw new Error('Failed to distributor');
	}
};

type MarketShareData = {
	results: MarketShare[];
};

/**
 * Get market share data from the backend.
 * @returns {Promise<MarketShareData>}
 */
export async function getMarketshare(): Promise<MarketShareData> {
	try {
		const url = getDistributorMarketShareEndpoint();
		return await request<MarketShareData>(url);
	} catch (error) {
		throw new Error('Failed to distributor');
	}
}

/**
 * Countries
 */

/**
 * Get paginated list of countrys.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns paginated list of countrys from the api.
 * @example
 * const { data, error } = useCountryList(1, 10);
 */
export const useCountryList = async (
	page: number = 1,
	limit: number = 10
): Promise<CountryListData> => {
	try {
		const url = getCountryListEndpoint(page, limit);
		return await request<CountryListData>(url);
	} catch (error) {
		throw new Error('Failed to country');
	}
};

/**
 * Get a single country.
 * @param {string} slug - Country slug.
 * @returns a single country from the api.
 * @example
 * const country = await getCountry('united-kingdom');
 */
export async function getCountry(slug: string): Promise<Country> {
	try {
		const url = getCountryEndpoint(slug);
		return await request<Country>(url);
	} catch (error) {
		throw new Error('Failed to country');
	}
}

/**
 * Get a single countries and its films paginated.
 * @param {string} slug - Country slug.
 * @param {number} page - Page number to start from.
 * @param {number} limit - Number of items per page.
 * @returns a single country and its paginated films from the api.
 * @example
 * const { data, error } = useCountryFilms('uk', 1, 10);
 */
export const useCountryFilms = async (
	slug: string,
	page: number,
	limit: number
): Promise<CountryFilmsData> => {
	try {
		const url = getCountryFilmsEndpoint(slug, page, limit);
		return await request<CountryFilmsData>(url);
	} catch (error) {
		throw new Error('Failed to country');
	}
};

/**
 * Get a single countries and its box office.
 * @param {string} slug - Country slug.
 * @param {number} limit - Years to go back.
 * @returns a single country and box office from the api.
 * @example
 * const data = getCountryBoxOffice('uk', 10);
 */
export const getCountryBoxOffice = async (
	slug: string,
	limit: number
): Promise<CountryBoxOffice> => {
	try {
		const url = getCountryBoxOfficeEndpoint(slug, limit);
		return await request<CountryBoxOffice>(url);
	} catch (error) {
		throw new Error('Failed to distributor');
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
 * const { data, error } = useSearch('uk');
 */
export const useSearch = async (
	searchParams: SearchParams
): Promise<SearchResults> => {
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
		return await request<SearchResults>(url);
	} catch (error) {
		throw new Error('Failed to distributor');
	}
};

// Make the options search request
export async function SearchFilms(term: string): Promise<FilmOption[]> {
	try {
		const url = getSearchFilmEndpoint(term);
		return await request<FilmOption[]>(url);
	} catch (error) {
		throw new Error('Failed to distributor');
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
 * const data = await getForecast();
 */
export async function getForecast(
	start: string,
	end: string,
	limit: number = 10
): Promise<ForecastData> {
	try {
		const url = getForecastEndpoint(start, end, limit);
		return await request<ForecastData>(url);
	} catch (error) {
		throw new Error('Failed to distributor');
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
 * const events = await getEvents());
 */
export async function getEvents(): Promise<EventsOverview> {
	try {
		const url = getEventsEndpoint();
		return await request<EventsOverview>(url);
	} catch (error) {
		throw new Error('Failed to distributor');
	}
}
