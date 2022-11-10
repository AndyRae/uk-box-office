import { Suspense } from 'react';
import { useSearch } from '../api/search';
import { Spinner } from '../components/ui/Spinner';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FilmsTable } from '../components/Search/FilmsTable';
import { Searchbar } from '../components/Search/Searchbar';
import { PageTitle } from '../components/ui/PageTitle';

const MainSearchPage = () => {
	const location = useLocation();
	const query = new URLSearchParams(location.search).get('q');
	const { data, isLoading, isError } = useSearch(query);

	return (
		<div>
			<PageTitle>Search Results: {query}</PageTitle>
			<div className='max-w-xl'>
				<Searchbar value={query} />
			</div>

			<hr className='my-5'></hr>

			{data.countries.length > 0 ? (
				<div className='leading-10'>
					<h2 className='text-2xl font-bold py-5 capitalize'>Countries</h2>

					{data.countries.map((country, index) => {
						return (
							<div key={index}>
								<Link
									to={`/country/${country.slug}`}
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
									to={`/distributor/${distributor.slug}`}
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
		</div>
	);
};

export const MainSearch = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<MainSearchPage />
		</Suspense>
	);
};
