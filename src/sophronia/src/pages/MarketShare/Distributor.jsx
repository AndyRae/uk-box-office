import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { useDistributorMarketShare } from '../../api/distributors';
import { MarketShareChart } from '../../components/Distributor/MarketShareChart';

const MarketShareDistributorPage = () => {
	const { data, error } = useDistributorMarketShare();

	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>
				Distributor Market Share
			</h1>

			{data && <MarketShareChart data={data.results} />}
		</div>
	);
};

export const MarketShareDistributor = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<MarketShareDistributorPage />
		</Suspense>
	);
};
