import { useState } from 'react';
import { useCountryList } from '../../api/countries';
import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';
import { Pagination } from '../../components/ui/Pagination';
import { paginate } from '../../utils/pagination';
import { CountryList } from '../../components/Country/CountryList';
import { PageTitle } from '../../components/ui/PageTitle';

/**
 * Countries Page
 * @returns {JSX.Element}
 */
export const CountriesPage = () => {
	const [pageIndex, setPageIndex] = useState(1);
	const pageLimit = 15;
	const { data, error } = useCountryList(pageIndex, pageLimit);
	const pageNumbers = paginate(data?.count, pageIndex, pageLimit);

	return (
		<>
			<PageTitle>Countries</PageTitle>
			<CountryList countries={data} pageIndex={pageIndex} />
			<Pagination
				pages={pageNumbers}
				setPageIndex={setPageIndex}
				pageIndex={pageIndex}
			/>
		</>
	);
};

/**
 * Countries Page
 * Wrapped in a Suspense show a loading state while data is being fetched.
 * @returns {JSX.Element}
 */
export const Countries = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<CountriesPage />
		</Suspense>
	);
};
