import { fetchCountryList } from '@/lib/api/dataFetching';
import { paginate } from '@/lib/helpers/pagination';
import { Pagination } from '@/components/custom/pagination';
import { PageTitle } from '@/components/custom/page-title';
import { DataTable } from '@/components/vendor/data-table';
import { columns } from '@/components/tables/countries';

export default async function Page({
	searchParams,
}: {
	params: { slug: string };
	searchParams: { p?: number };
}): Promise<JSX.Element> {
	let pageIndex = searchParams?.p ?? 1;

	const pageLimit = 15;
	const data = await fetchCountryList(pageIndex, pageLimit);
	const pageNumbers = paginate(data!.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Countries</PageTitle>
			{data && <DataTable columns={columns} data={data.results} />}
			<Pagination pages={pageNumbers} pageIndex={pageIndex} />
		</>
	);
}
