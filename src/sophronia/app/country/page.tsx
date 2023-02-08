'use client';

import { useCountryList } from 'lib/countries';
import { useState } from 'react';
import { paginate } from 'lib/utils/pagination';
import { CountryList } from './CountryList';
import { Pagination } from 'components/ui/Pagination';
import { PageTitle } from 'components/ui/PageTitle';

export default function Page() {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data, error } = useCountryList(pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Countries</PageTitle>
			<CountryList countries={data} />
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
}
