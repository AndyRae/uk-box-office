import Link from 'next/link';
import { useSearch } from 'lib/fetch/search';
import { FilmsTable } from 'components/tables/films-table';
import { Searchbar } from 'components/search';
import { PageTitle } from 'components/ui/page-title';

import { Distributor } from 'interfaces/Distributor';
import { Country } from 'interfaces/Country';
import { SearchFilters } from 'components/search-filters';

import { toTitleCase } from 'lib/utils/toTitleCase';

export default async function Page({
	searchParams,
}: {
	searchParams: { q: string };
}): Promise<JSX.Element> {
	const query = searchParams?.q ?? '';
	const data = await useSearch(searchParams);

	return (
		<>
			<PageTitle>Search Results: {query}</PageTitle>
			<div className='max-w-xl'>
				<Searchbar />
			</div>

			<hr className='my-5'></hr>

			{data!.countries.length > 0 ? (
				<div className='leading-10'>
					<h2 className='text-2xl font-bold py-5 capitalize'>Countries</h2>

					{data!.countries.map((country: Country, index: number) => {
						return (
							<div key={index}>
								<Link
									href={`/country/${country.slug}`}
									className='font-bold text-left'
								>
									{country.name}
								</Link>
							</div>
						);
					})}
					<hr className='my-10'></hr>
				</div>
			) : null}

			{data!.distributors.length > 0 ? (
				<div className='leading-10'>
					<h2 className='text-2xl font-bold py-5 capitalize'>Distributors</h2>

					{data!.distributors.map((distributor: Distributor, index: number) => {
						return (
							<div key={index} className=''>
								<Link
									href={`/distributor/${distributor.slug}`}
									className='font-bold text-left'
								>
									{toTitleCase(distributor.name)}
								</Link>
							</div>
						);
					})}

					<hr className='my-10'></hr>
				</div>
			) : null}

			{data!.films.results.length > 0 && (
				<h2 className='text-2xl font-bold py-5 capitalize'>Films</h2>
			)}
			<SearchFilters
				query={query}
				distributors={data.films.distributors}
				countries={data.films.countries}
				maxGross={data.films.max_gross}
			/>

			{data!.films ? <FilmsTable data={data!.films.results} /> : null}
		</>
	);
}
