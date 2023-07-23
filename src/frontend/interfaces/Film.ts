import { Country } from './Country';
import { Distributor } from './Distributor';
import { BoxOfficeWeekStrict } from './BoxOffice';

export interface Film {
	id: number;
	name: string;
	slug: string;
	gross: number;
	countries: Country[];
	distributors: Distributor[];
}

export interface FilmWithWeeks extends Film {
	weeks: BoxOfficeWeekStrict[];
	color?: string;
}

export interface FilmListData {
	count: number;
	next: number;
	previous: number;
	results: Film[];
}

export interface TopFilm {
	film: {
		name: string;
		slug: string;
		distributors: Distributor[];
	};
	gross: number;
}

export type FilmOption = {
	value: string;
	label: string;
};
