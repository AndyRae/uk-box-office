import { fetchDistributorFilms } from 'lib/dataFetching';
import { FilmTable } from 'components/tables/film-table';
import { Pagination } from 'components/ui/pagination';
import { paginate } from 'lib/utils/pagination';

/**
 * @description Distributor Films List component
 * A client side component that fetches data from the API.
 * @param {String} slug - Distributor slug
 * @returns {JSX.Element}
 * @example
 * <DistributorFilmsList slug={slug} />
 */
export const DistributorFilmsTable = async ({
	slug,
	pageIndex,
}: {
	slug: string;
	pageIndex: number;
}): Promise<JSX.Element> => {
	const pageLimit = 15;

	const data = await fetchDistributorFilms(slug, pageIndex, pageLimit);

	const pageNumbers = paginate(data.count, pageIndex, pageLimit);

	return (
		<>
			{data && <FilmTable films={data} />}
			<Pagination pages={pageNumbers} pageIndex={pageIndex} />
		</>
	);
};
