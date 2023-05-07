import { Film } from './Film';

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

export interface BoxOfficeYear {
	total: number;
	count: number;
	year: string;
}

export interface DistributorBoxOffice {
	results: BoxOfficeYear[];
}
