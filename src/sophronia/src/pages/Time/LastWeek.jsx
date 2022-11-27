import { Navigate } from 'react-router-dom';
import { TimePage } from './Time';
import { Dashboard } from '../Dashboard';
import { useBoxOffice } from '../../api/boxoffice';
import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';

/**
 * Redirects to the last available box office data week.
 * @returns
 */
export const LastWeekPage = () => {
	const { data, error } = useBoxOffice();

	if (data.results) {
		const lastWeek = data.results[0].date;
		const [year, month, day] = lastWeek.split('-');

		return <Navigate to={`/time/${year}/m${parseInt(month, 10)}/d${day}`} />;
	}

	return <Navigate to={<Dashboard />} />;
};

export const LastWeek = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<LastWeekPage />
		</Suspense>
	);
};
