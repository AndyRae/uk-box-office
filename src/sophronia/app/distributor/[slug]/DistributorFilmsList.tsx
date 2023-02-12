'use client';

import { useDistributorFilms } from 'lib/distributors';
import { FilmTable } from 'components/Film/FilmTable';
import { Pagination } from 'components/ui/Pagination';
import { paginate } from 'lib/utils/pagination';
import { useState } from 'react';

/**
 * @description Distributor Films List component
 * A client side component that fetches data from the API.
 * @param {String} slug - Distributor slug
 * @returns {JSX.Element}
 * @example
 * <DistributorFilmsList slug={slug} />
 */
export const DistributorFilmsList = ({
	slug,
}: {
	slug: string;
}): JSX.Element => {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;

	const { data, error } = useDistributorFilms(slug, pageIndex, pageLimit);

	const pageNumbers = paginate(data!.count, pageIndex, pageLimit);

	return (
		<>
			{data && <FilmTable films={data} />}
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
};
