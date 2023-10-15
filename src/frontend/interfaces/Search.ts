import { Country } from './Country';
import { Distributor } from './Distributor';
import { Film } from './Film';

export interface SearchResults {
	countries: Country[];
	distributors: Distributor[];
	films: {
		count: number;
		next: number;
		previous: number;
		results: Film[];
		distributors: Distributor[];
		countries: Country[];
		max_gross: number;
	};
}

export interface SearchParams {
	q: string;
	distributor?: string;
	country?: string;
	max_gross?: string;
	min_gross?: string;
	p?: string;
	min_year?: string;
	max_year?: string;
	sort?: string;
}
