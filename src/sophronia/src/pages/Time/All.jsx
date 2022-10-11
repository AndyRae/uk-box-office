import { useBoxOfficeSummary } from '../../api/boxoffice';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense } from 'react';
import { YearsTable } from '../../components/Time/YearsTable';

export const AllTimePage = () => {
	const today = new Date().getFullYear();

	const startDate = `${today}-${1}-${1}`;
	const endDate = `${today}-${12}-${31}`;

	const { data, error } = useBoxOfficeSummary(startDate, endDate, 25);

	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>
				All Time Box Office
			</h1>

			<YearsTable data={data.results} />
		</div>
	);
};

export const All = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<AllTimePage />
		</Suspense>
	);
};
