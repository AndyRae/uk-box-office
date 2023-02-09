import { Country } from './Country';
import { Distributor } from './Distributor';

export interface Film {
	id: number;
	name: string;
	slug: string;
	gross: number;
	countries: Country[];
	distributor: Distributor;
}

export interface FilmWithWeeks extends Film {
	weeks: {
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
	}[];
}

export interface FilmListData {
	count: number;
	next: number;
	previous: number;
	results: Film[];
}
