import { fetchCountryFilms } from '@/lib/api/dataFetching';
import { FilmTable } from '@/components/tables/film-table';
import { Pagination } from '@/components/custom/pagination';
import { paginate } from '@/lib/helpers/pagination';

/**
 * @description Country Films List component
 * A client side component that fetches data from the API.
 * @param {String} slug - Country slug
 * @returns {JSX.Element}
 * @example
 * <CountryFilmsTable slug={slug} />
 */
export const CountryFilmsTable = async ({
	slug,
	pageIndex,
}: {
	slug: string;
	pageIndex: number;
}): Promise<JSX.Element> => {
	const pageLimit = 15;

	const data = await fetchCountryFilms(slug, pageIndex, pageLimit);

	const pageNumbers = paginate(data!.count, pageIndex, pageLimit);

	return (
		<>
			{data && <FilmTable films={data} />}
			<Pagination pages={pageNumbers} pageIndex={pageIndex} />
		</>
	);
};
