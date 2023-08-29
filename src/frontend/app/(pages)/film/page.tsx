import { fetchFilmList } from '@/lib/api/dataFetching';
import { paginate } from '@/lib/helpers/pagination';
import { Pagination } from '@/components/custom/pagination';
import { PageTitle } from '@/components/custom/page-title';
import { DataTable } from '@/components/vendor/data-table';
import { columns } from '@/components/tables/films';

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
	// Get the page number from url or default to 1
	let pageIndex = searchParams?.p ?? 1;

	const pageLimit = 15;
	const data = await fetchFilmList(pageIndex, pageLimit);
	const pageNumbers = paginate(data.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Films</PageTitle>
			{data && <DataTable columns={columns} data={data.results} />}
			<Pagination pages={pageNumbers} pageIndex={pageIndex} />
		</>
	);
}
