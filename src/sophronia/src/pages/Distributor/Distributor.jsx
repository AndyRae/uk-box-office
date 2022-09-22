import { useDistributor } from '../../api/distributors';
import { useParams } from 'react-router-dom';
import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';

export const DistributorPage = () => {
	const { slug } = useParams();
	const { data, error } = useDistributor(slug);

	return (
		<div>
			<h1 className='text-3xl font-bold underline'>{data.name}</h1>
		</div>
	);
};

export const Distributor = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<DistributorPage />
		</Suspense>
	);
};
