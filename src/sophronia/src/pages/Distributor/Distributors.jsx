import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDistributorList } from '../../api/distributors';
import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { Pagination } from '../../components/ui/Pagination';
import { paginate } from '../../utils/pagination';
import { DistributorList } from '../../components/Distributor/DistributorList';

export const DistributorsPage = () => {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data, error } = useDistributorList(pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	return (
		<>
			<DistributorList distributors={data} pageIndex={pageIndex} />
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
};

export const Distributors = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<DistributorsPage />
		</Suspense>
	);
};
