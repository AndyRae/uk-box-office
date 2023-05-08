import { Film } from './Film';
import { BoxOfficeYear } from './BoxOffice';

export interface Distributor {
	id: number;
	name: string;
	slug: string;
}

export interface DistributorListData {
	count: number;
	next: number;
	previous: number;
	results: Distributor[];
}

export interface DistributorFilmsData {
	count: number;
	next: number;
	previous: number;
	distributor: Distributor;
	results: Film[];
}

export interface DistributorBoxOffice {
	results: BoxOfficeYear[];
}
