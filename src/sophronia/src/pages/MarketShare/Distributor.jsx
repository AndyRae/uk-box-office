import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { useDistributorMarketShare } from '../../api/distributors';
import { MarketShareChart } from '../../components/Distributor/MarketShareChart';
import { PageTitle } from '../../components/ui/PageTitle';

const MarketShareDistributorPage = () => {
	const { data, error } = useDistributorMarketShare();

	return (
		<div>
			<PageTitle>Distributor Market Share</PageTitle>

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
