'use client';

import { useFilmList } from 'lib/films';
import { useState } from 'react';
import { paginate } from 'lib/utils/pagination';
import { FilmList } from './FilmList';
import { Pagination } from 'components/ui/pagination';
import { PageTitle } from 'components/ui/page-title';

export default function Page(): JSX.Element {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data, error } = useFilmList(pageIndex, pageLimit);
	const pageNumbers = paginate(data!.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Films</PageTitle>
			{data && <FilmList films={data} />}
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
}
