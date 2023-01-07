'use client';

import { useFilmList } from 'lib/films';
import { useState } from 'react';
import { paginate } from 'lib/utils/pagination';

export default function Page() {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data, error } = useFilmList(pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	return <div>Holding Page {pageNumbers}</div>;
}
