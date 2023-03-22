'use client';

import { useCountryList } from 'lib/countries';
import { useState } from 'react';
import { paginate } from 'lib/utils/pagination';
import { CountryList } from './CountryList';
import { Pagination } from 'components/ui/pagination';
import { PageTitle } from 'components/ui/page-title';

export default function Page(): JSX.Element {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data } = useCountryList(pageIndex, pageLimit);
	const pageNumbers = paginate(data!.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Countries</PageTitle>
			{data && <CountryList countries={data} />}
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
}
