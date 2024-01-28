import { db } from '@/db/db';

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
