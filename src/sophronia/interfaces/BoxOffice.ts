export interface Forecast {
	date: string;
	forecast_medium: number;
	forecast_high: number;
	forecast_low: number;
	week_gross: number;
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
