'use client';

import { useDistributorList } from 'lib/distributors';
import { useState } from 'react';
import { paginate } from 'lib/utils/pagination';
import { DistributorList } from './DistributorList';
import { Pagination } from 'components/ui/Pagination';
import { PageTitle } from 'components/ui/PageTitle';

export default function Page(): JSX.Element {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data, error } = useDistributorList(pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Distributors</PageTitle>
			<DistributorList distributors={data} />
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
}