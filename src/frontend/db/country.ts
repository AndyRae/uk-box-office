import { db } from '@/db/db';
import { FilmSortOption } from '@/interfaces/Film';

export const get = async (slug: string) => {
	return await db.country.findFirst({
		where: { slug: slug },
	});
};

export async function list(page: number = 1, limit: number = 100) {
	const skip = (page - 1) * limit;

	const countries = await db.country.findMany({
		skip: skip,
		take: limit,
		orderBy: {
			name: 'asc',
		},
	});

	const totalCountries = await db.country.count();

	const next_page = page * limit < totalCountries ? page + 1 : undefined;
	const previous_page = page > 1 ? page - 1 : undefined;

	return {
		count: totalCountries,
		next: next_page,
		previous: previous_page,
		results: countries,
	};
}

export async function getBoxOffice(slug: string, limit: number) {
	const now = new Date();
	now.setFullYear(now.getFullYear() - limit);

	const data = await db.film_week.findMany({
		select: {
			date: true,
			total_gross: true,
			film: {
				select: {
					id: true,
				},
			},
		},
		where: {
			date: {
				gte: now,
			},
			film: {
				countries: {
					some: {
						country: {
							slug: slug,
						},
					},
				},
			},
		},
		orderBy: {
			date: 'desc',
		},
	});

	// Have to the groupby in app code.
	const groupedData = new Map<
		number,
		{ total_gross: number; filmCount: number }
	>();

	data.forEach((row) => {
		const year = new Date(row.date).getFullYear();
		if (!groupedData.has(year)) {
			groupedData.set(year, { total_gross: 0, filmCount: 0 });
		}
		groupedData.get(year)!.total_gross += row.total_gross || 0;
		groupedData.get(year)!.filmCount += row.film ? 1 : 0;
	});

	// Convert Map to an array of objects
	const results = Array.from(groupedData.entries()).map(
		([year, { total_gross, filmCount }]) => ({
			year: year.toString(),
			total: total_gross,
			count: filmCount,
		})
	);

	return {
		results: results,
	};
}

// TODO: Add sorting.
export async function getFilms(
	slug: string,
	page: number,
	limit: number,
	sort: FilmSortOption
) {
	const country = await db.country.findUnique({
		where: {
			slug: slug,
		},
	});

	if (!country) {
		// Handle country not found
		return null;
	}

	const films = await db.film.findMany({
		include: {
			distributors: {
				select: {
					distributor: true,
				},
			},
			countries: {
				select: {
					country: true,
				},
			},
			film_week: {
				select: {
					total_gross: true,
				},
			},
		},
		where: {
			countries: {
				some: {
					country: {
						id: country.id,
					},
				},
			},
		},
		skip: (page - 1) * limit,
		take: limit,
	});

	const filmsWithGross = films.map((film) => ({
		...film,
		gross: film.film_week.reduce(
			(acc, week) => acc + (week.total_gross || 0),
			0
		),
		countries: film.countries.map((country) => ({
			id: country.country.id,
			name: country.country.name,
			slug: country.country.slug,
		})),
		distributors: film.distributors.map((distributor) => ({
			id: distributor.distributor.id,
			name: distributor.distributor.name,
			slug: distributor.distributor.slug,
		})),
	}));

	const totalFilms = await db.film.count({
		where: {
			countries: {
				some: {
					country_id: country.id,
				},
			},
		},
	});

	const next_page = page * limit < totalFilms ? page + 1 : undefined;
	const previous_page = page > 1 ? page - 1 : undefined;

	return {
		country: country,
		count: totalFilms,
		next: next_page,
		previous: previous_page,
		results: filmsWithGross,
	};
}
