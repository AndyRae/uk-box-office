import { Country } from './Country';
import { Distributor } from './Distributor';
import { BoxOfficeWeek } from './BoxOffice';

export interface Film {
	id: number;
	name: string;
	slug: string;
	gross: number;
	countries: Country[];
	distributor: Distributor;
}

export interface FilmWithWeeks extends Film {
	weeks: BoxOfficeWeek[];
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
		distributor: {
			name: string;
		};
	};
	gross: number;
}
