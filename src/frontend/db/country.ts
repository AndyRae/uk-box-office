import { db } from '@/db/db';

export const getCountry = async (slug: string) => {
	return await db.country.findFirst({
		where: { slug: slug },
	});
};

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
