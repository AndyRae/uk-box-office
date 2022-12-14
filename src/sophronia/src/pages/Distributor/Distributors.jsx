import { useState } from 'react';
import { useDistributorList } from '../../api/distributors';
import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { Pagination } from '../../components/ui/Pagination';
import { paginate } from '../../utils/pagination';
import { DistributorList } from '../../components/Distributor/DistributorList';
import { PageTitle } from '../../components/ui/PageTitle';

/**
 * Distributors Page
 * @returns {JSX.Element}
 */
export const DistributorsPage = () => {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data, error } = useDistributorList(pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Distributors</PageTitle>
			<DistributorList distributors={data} pageIndex={pageIndex} />
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
};

/**
 * Distributors Page
 * Wrapped in a Suspense show a loading state while data is being fetched.
 * @returns {JSX.Element}
 */
export const Distributors = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<DistributorsPage />
		</Suspense>
	);
};
