import { db } from '@/db/db';

export const getCountry = async (slug: string) => {
	return await db.country.findFirst({
		where: { slug: slug },
	});
};
