import { Country } from './Country';

export default interface Film {
	id: number;
	name: string;
	slug: string;
	gross: number;
	weeks: {
		date: string;
		weekend_gross: number;
		total_gross: number;
		weeks_on_release: number;
	}[];
	countries: Country[];
	distributor: {
		id: number;
		name: string;
		slug: string;
	};
}
