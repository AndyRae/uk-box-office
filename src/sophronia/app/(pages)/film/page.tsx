import { useFilmList } from 'lib/films';
import { paginate } from 'lib/utils/pagination';
import { Pagination } from 'components/ui/pagination';
import { PageTitle } from 'components/ui/page-title';
import { FilmTable } from 'components/tables/film-table';

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
	const data = await useFilmList(pageIndex, pageLimit);
	const pageNumbers = paginate(data.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Films</PageTitle>
			{data && <FilmTable films={data} />}
			<Pagination pages={pageNumbers} pageIndex={pageIndex} />
		</>
	);
}
