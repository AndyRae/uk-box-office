import { useCountry } from '../../api/countries';
import { useParams } from 'react-router-dom';
import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';

export const CountryPage = () => {
	const { slug } = useParams();
	const { data, error } = useCountry(slug);

	return (
		<div>
			<h1 className='text-3xl font-bold underline'>{data.name}</h1>
		</div>
	);
};

export const Country = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<CountryPage />
		</Suspense>
	);
};
