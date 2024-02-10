import { db } from '@/db/db';
import { FilmSortOption } from '@/interfaces/Film';
import { Prisma } from '@prisma/client';

export const get = async (slug: string) => {
	return await db.distributor.findFirst({
		where: { slug: slug },
	});
};

export async function list(page: number = 1, limit: number = 100) {
	const skip = (page - 1) * limit;

	const distributors = await db.distributor.findMany({
		skip: skip,
		take: limit,
		orderBy: {
			name: 'asc',
		},
	});

	const totaldistributors = await db.distributor.count();

	const next_page = page * limit < totaldistributors ? page + 1 : undefined;
	const previous_page = page > 1 ? page - 1 : undefined;

	return {
		count: totaldistributors,
		next: next_page,
		previous: previous_page,
		results: distributors,
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
				distributors: {
					some: {
						distributor: {
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

export async function getFilms(
	slug: string,
	page: number,
	limit: number,
	sort: FilmSortOption
) {
	const distributor = await db.distributor.findUnique({
		where: {
			slug: slug,
		},
	});

	if (!distributor) {
		// Handle distributor not found
		return null;
	}

	let orderBy: Prisma.filmOrderByWithRelationInput | undefined;

	switch (sort) {
		case 'asc_name':
			orderBy = { name: 'asc' };
			break;
		case 'desc_name':
			orderBy = { name: 'desc' };
			break;
		default:
			orderBy = { name: 'asc' };
	}

	const films = await db.film.findMany({
		include: {
			countries: {
				select: {
					country: true,
				},
			},
			distributors: {
				select: {
					distributor: true,
				},
			},
			film_week: {
				select: {
					total_gross: true,
				},
			},
		},
		where: {
			distributors: {
				some: {
					distributor: {
						id: distributor.id,
					},
				},
			},
		},
		orderBy: orderBy,
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
			distributors: {
				some: {
					distributor_id: distributor.id,
				},
			},
		},
	});

	const next_page = page * limit < totalFilms ? page + 1 : undefined;
	const previous_page = page > 1 ? page - 1 : undefined;

	return {
		distributor: distributor,
		count: totalFilms,
		next: next_page,
		previous: previous_page,
		results: filmsWithGross,
	};
}
