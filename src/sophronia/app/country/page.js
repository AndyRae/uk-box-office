'use client';

import { useCountryList } from 'lib/countries';
import { useState } from 'react';
import { paginate } from 'lib/utils/pagination';

export default function Page() {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data, error } = useCountryList(pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	return <div>Holding Page</div>;
}
