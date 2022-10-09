import { useBoxOfficeFiltered } from '../api/boxoffice';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Suspense } from 'react';
import { Spinner } from '../components/ui/Spinner';

export const DashboardPage = () => {
	const { data, error } = useBoxOfficeFiltered();

	console.log(data);

	return (
		<div>
			<h1 className='text-3xl font-bold underline'>Dashboard</h1>

			{data &&
				data.results.map((result) => {
					return (
						<div key={result.id}>
							<h2>{result.film}</h2>
							<Link to={`film/${result.film_slug}`}>Link</Link>
						</div>
					);
				})}
		</div>
	);
};

export const Dashboard = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<DashboardPage />
		</Suspense>
	);
};
