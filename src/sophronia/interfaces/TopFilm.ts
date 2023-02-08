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
