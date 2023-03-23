import { useDistributorList } from 'lib/distributors';
import { paginate } from 'lib/utils/pagination';
import { DistributorList } from './DistributorList';
import { Pagination } from 'components/ui/pagination';
import { PageTitle } from 'components/ui/page-title';

type Props = {
	params?: {
		num?: string;
	};
	searchParams?: {
		p?: number;
	};
};

export default async function Page({
	searchParams,
}: Props): Promise<JSX.Element> {
	let pageIndex = searchParams?.p ?? 1;
	const pageLimit = 15;
	const data = await useDistributorList(pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Distributors</PageTitle>
			{data && <DistributorList distributors={data} />}
			<Pagination pages={pageNumbers} pageIndex={pageIndex} />
		</>
	);
}
