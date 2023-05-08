import { BoxOfficeYear } from './BoxOffice';
import { Film } from './Film';

export interface Country {
	id: string;
	name: string;
	slug: string;
}
export interface CountryListData {
	results: Country[];
	count: number;
	next: number;
	previous: number;
}

export interface CountryFilmsData {
	country: Country;
	count: number;
	next: number;
	previous: number;
	results: Film[];
}

export interface CountryBoxOffice {
	results: BoxOfficeYear[];
}
