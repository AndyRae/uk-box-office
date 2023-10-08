import { fetchFilmList } from '@/lib/api/dataFetching';
import { paginate } from '@/lib/helpers/pagination';
import { Pagination } from '@/components/custom/pagination';
import { PageTitle } from '@/components/custom/page-title';
import { FilmTable } from '@/components/tables/films';

type Props = {
	params?: {
		num?: string;
	};
	searchParams?: {
		p?: number;
		sort?: string;
	};
};

export default async function Page({
	searchParams,
}: Props): Promise<JSX.Element> {
	// Get the page number from url or default to 1
	const pageIndex = searchParams?.p ?? 1;
	const sort = searchParams?.sort ?? 'asc_name';

	const pageLimit = 15;
	const data = await fetchFilmList(pageIndex, pageLimit, sort);
	const pageNumbers = paginate(data.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Films</PageTitle>
			{data && <FilmTable data={data.results} />}
			<Pagination pages={pageNumbers} pageIndex={pageIndex} />
		</>
	);
}
