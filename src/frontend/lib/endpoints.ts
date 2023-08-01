/**
 * Returns the backend URL based on the environment
 * @returns {string} The backend URL
 * @example
 * returns http://localhost:5000/api/
 */
export const getApi = (): string => {
	if (process.env.NEXT_PUBLIC_CODESPACE === 'true') {
		return `https://${process.env.NEXT_PUBLIC_CODESPACE_NAME}-5000.${process.env.NEXT_PUBLIC_GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/api`;
	}

	if (process.env.NODE_ENV === 'development') {
		return 'http://localhost:5000/api';
	}

	return (
		process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.boxofficedata.co.uk/api'
	);
};

// Box Office
export const getBoxOfficeSummaryEndpoint = (
	startDate: string,
	endDate: string,
	limit: number
): string => {
	return `/boxoffice/summary?start=${startDate}&end=${endDate}&limit=${limit}`;
};

export const getBoxOfficePreviousYearEndpoint = (
	start: string,
	end: string
): string => {
	return `/boxoffice/previousyear?start=${start}&end=${end}`;
};

export const getBoxOfficeTopFilmsEndpoint = (): string => {
	return `/boxoffice/topfilms`;
};

export const getBoxOfficeInfiniteEndpoint = (): string => {
	return `/boxoffice/all`;
};

export const getBoxOfficeToplineEndpoint = (
	startDate: string,
	endDate: string,
	limit: number
): string => {
	return `/boxoffice/topline?start=${startDate}&end=${endDate}&limit=${limit}`;
};

export const getBoxOfficeLastWeekEndpoint = (): string => {
	return `/boxoffice/all`;
};

// Films
export const getFilmListEndpoint = (page: number, limit: number): string => {
	return `/film/?page=${page}&limit=${limit}`;
};

export const getFilmIdEndpoint = (id: number): string => {
	return `/film/id/${id}`;
};

export const getFilmSlugEndpoint = (slug: string): string => {
	return `/film/slug/${slug}`;
};

// Distributors
export const getDistributorListEndpoint = (
	page: number,
	limit: number
): string => {
	return `/distributor/?page=${page}&limit=${limit}`;
};

export const getDistributorFilmsEndpoint = (
	slug: string,
	page: number,
	limit: number
): string => {
	return `/distributor/${slug}/films?page=${page}&limit=${limit}`;
};

export const getDistributorEndpoint = (slug: string): string => {
	return `/distributor/${slug}`;
};

export const getDistributorBoxOfficeEndpoint = (
	slug: string,
	limit: number
): string => {
	return `/distributor/${slug}/boxoffice?limit=${limit}`;
};

export const getDistributorMarketShareEndpoint = (): string => {
	return `/distributor/marketshare`;
};

// Countries
export const getCountryListEndpoint = (page: number, limit: number): string => {
	return `/country/?page=${page}&limit=${limit}`;
};

export const getCountryFilmsEndpoint = (
	slug: string,
	page: number,
	limit: number
): string => {
	return `/country/${slug}/films?page=${page}&limit=${limit}`;
};

export const getCountryEndpoint = (slug: string): string => {
	return `/country/${slug}`;
};

export const getCountryBoxOfficeEndpoint = (
	slug: string,
	limit: number
): string => {
	return `/country/${slug}/boxoffice?limit=${limit}`;
};

// Search
export const getSearchEndpoint = (query: string): string => {
	return `/search?${query}`;
};

export const getSearchFilmEndpoint = (query: string): string => {
	return `/search/film?q=${query}`;
};

// Forecast
export const getForecastEndpoint = (
	startDate: string,
	endDate: string,
	limit: number
): string => {
	return `/boxoffice/topline?start=${startDate}&end=${endDate}&limit=${limit}`;
};

// Events
export const getEventsEndpoint = (): string => {
	return `/events`;
};
