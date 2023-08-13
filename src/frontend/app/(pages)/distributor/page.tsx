import { fetchDistributors } from 'lib/dataFetching';
import { paginate } from 'lib/helpers/pagination';
import { Pagination } from '@/components/ui/pagination';
import { PageTitle } from '@/components/ui/page-title';
import { DistributorTable } from '@/components/tables/distributor-table';

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
	const data = await fetchDistributors(pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Distributors</PageTitle>
			{data && <DistributorTable distributors={data} />}
			<Pagination pages={pageNumbers} pageIndex={pageIndex} />
		</>
	);
}
