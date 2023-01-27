'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSearch } from 'lib/search';
import { FilmsTable } from './FilmsTable';
import { Searchbar } from 'components/Search/Searchbar';
import { PageTitle } from 'components/ui/PageTitle';

export default function Page() {
	const searchParams = useSearchParams();

	const query = searchParams.get('q');

	const { data, isLoading, isError } = useSearch(query);

	return (
		<>
			<PageTitle>Search Results: {query}</PageTitle>
			<div className='max-w-xl'>
				<Searchbar />
			</div>

			<hr className='my-5'></hr>

			{data.countries.length > 0 ? (
				<div className='leading-10'>
					<h2 className='text-2xl font-bold py-5 capitalize'>Countries</h2>

					{data.countries.map((country, index) => {
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

			{data.distributors.length > 0 ? (
				<div className='leading-10'>
					<h2 className='text-2xl font-bold py-5 capitalize'>Distributors</h2>

					{data.distributors.map((distributor, index) => {
						return (
							<div key={index} className=''>
								<Link
									href={`/distributor/${distributor.slug}`}
									className='font-bold text-left'
								>
									{distributor.name}
								</Link>
							</div>
						);
					})}

					<hr className='my-10'></hr>
				</div>
			) : null}

			{data.films.length > 0 && (
				<h2 className='text-2xl font-bold py-5 capitalize'>Films</h2>
			)}

			{data.films ? <FilmsTable data={data.films} /> : null}
		</>
	);
}
