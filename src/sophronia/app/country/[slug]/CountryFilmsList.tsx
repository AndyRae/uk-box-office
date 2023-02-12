'use client';

import { useCountryFilms } from 'lib/countries';
import { FilmTable } from 'components/Film/FilmTable';
import { Pagination } from 'components/ui/Pagination';
import { paginate } from 'lib/utils/pagination';
import { useState } from 'react';

/**
 * @description Country Films List component
 * A client side component that fetches data from the API.
 * @param {String} slug - Country slug
 * @returns {JSX.Element}
 * @example
 * <CountryFilmsList slug={slug} />
 */
export const CountryFilmsList = ({ slug }: { slug: string }): JSX.Element => {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;

	const { data, error } = useCountryFilms(slug, pageIndex, pageLimit);

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
