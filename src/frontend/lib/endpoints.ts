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
	return `${getApi()}/boxoffice/summary?start=${startDate}&end=${endDate}&limit=${limit}`;
};

export const getBoxOfficePreviousYearEndpoint = (
	start: string,
	end: string
): string => {
	return `${getApi()}/boxoffice/previousyear?start=${start}&end=${end}`;
};

export const getBoxOfficeTopFilmsEndpoint = (): string => {
	return `${getApi()}/boxoffice/topfilms`;
};

export const getBoxOfficeToplineEndpoint = (
	startDate: string,
	endDate: string,
	limit: number
): string => {
	return `${getApi()}/boxoffice/topline?start=${startDate}&end=${endDate}&limit=${limit}`;
};

// Films
export const getFilmListEndpoint = (page: number, limit: number): string => {
	return `${getApi()}/film/?page=${page}&limit=${limit}`;
};

export const getFilmIdEndpoint = (id: number): string => {
	return `${getApi()}/film/id/${id}`;
};

export const getFilmSlugEndpoint = (slug: string): string => {
	return `${getApi()}/film/slug/${slug}`;
};

// Distributors
export const getDistributorListEndpoint = (
	page: number,
	limit: number
): string => {
	return `${getApi()}/distributor/?page=${page}&limit=${limit}`;
};

export const getDistributorFilmsEndpoint = (
	slug: string,
	page: number,
	limit: number
): string => {
	return `${getApi()}/distributor/${slug}/films?page=${page}&limit=${limit}`;
};

export const getDistributorEndpoint = (slug: string): string => {
	return `${getApi()}/distributor/${slug}`;
};

export const getDistributorBoxOfficeEndpoint = (
	slug: string,
	limit: number
): string => {
	return `${getApi()}/distributor/${slug}/boxoffice?limit=${limit}`;
};

// Countries
export const getCountryListEndpoint = (page: number, limit: number): string => {
	return `${getApi()}/country/?page=${page}&limit=${limit}`;
};

export const getCountryFilmsEndpoint = (
	slug: string,
	page: number,
	limit: number
): string => {
	return `${getApi()}/country/${slug}/films?page=${page}&limit=${limit}`;
};

export const getCountryEndpoint = (slug: string): string => {
	return `${getApi()}/country/${slug}`;
};

export const getCountryBoxOfficeEndpoint = (
	slug: string,
	limit: number
): string => {
	return `${getApi()}/country/${slug}/boxoffice?limit=${limit}`;
};
