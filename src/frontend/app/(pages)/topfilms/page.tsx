import { PageTitle } from '@/components/custom/page-title';
import { columns } from '@/components/tables/films-top';
import { DataTable } from '@/components/vendor/data-table';
import { fetchBoxOfficeTopFilms } from '@/lib/api/dataFetching';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'All Time Top Films | Box Office Data',
	description:
		'Top 50 films of all time at the UK box office. Including dashboards, statistics, reports, and analysis.',
};

export default async function Page(): Promise<JSX.Element> {
	const data = await fetchBoxOfficeTopFilms();
	return (
		<>
			<PageTitle>All Time Top Films</PageTitle>
			<DataTable columns={columns} data={data.results} />
		</>
	);
}
