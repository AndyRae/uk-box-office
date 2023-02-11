export interface Topline {
	date: string;
	admissions: number;
	forecast_high: number;
	forecast_medium: number;
	forecast_low: number;
	week_gross: number;
	weekend_gross: number;
	number_of_cinemas: number;
	number_of_releases: number;
	id: number;
}

export interface BoxOfficeWeek {
	date: string;
	distributor: string;
	distributor_slug: string;
	film: string;
	film_slug: string;
	id: number;
	number_of_cinemas: number;
	rank: number;
	site_average: number;
	total_gross: number;
	week_gross: number;
	weekend_gross: number;
	weeks_on_release: number;
}

export interface BoxOfficeListData {
	count: number;
	next: string;
	previous: string;
	results: BoxOfficeWeek[];
}

export type StackedFilm = {
	label: string;
	slug: any;
	data: { x: any; y: any }[];
	borderColor: string;
	backgroundColor: string;
	hoverBackgroundColor: string;
	hoverBorderColor: string;
	fill: boolean;
	tension: number;
	pointStyle: string;
	pointRadius: number;
	borderRadius: number;
};

export type TableData = {
	title: string;
	filmSlug: string;
	distributor: string;
	weeks: number;
	weekGross: number;
	weekendGross: any;
	numberOfCinemas: number;
	siteAverage: number;
}[];

export type BoxOfficeGroup = {
	date: string;
	weekGross: number;
	weekendGross: number;
	newReleases: number;
};

export interface BoxOfficeSummary {
	admissions?: number;
	number_of_cinemas: number;
	number_of_releases: number;
	week_gross: number;
	weekend_gross: number;
	year: string;
}
