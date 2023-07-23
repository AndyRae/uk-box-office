import { PageTitle } from 'components/ui/page-title';
import { TopFilmsTable } from 'components/tables/top-films-table';
import { Metadata } from 'next';
import { fetchBoxOfficeTopFilms } from 'lib/dataFetching';

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
			<TopFilmsTable data={data} />
		</>
	);
}
