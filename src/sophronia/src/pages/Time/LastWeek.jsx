import { Navigate } from 'react-router-dom';
import { Dashboard } from '../Dashboard';
import { useBoxOffice } from '../../api/boxoffice';
import { Suspense } from 'react';
import { Spinner } from '../../components/ui/Spinner';

/**
 * Get the last week from the API and redirects to that week.
 * @returns {JSX.Element}
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

/**
 * Last Week Page
 * Wrapper for LastWeekPage to handle suspense
 * @returns {JSX.Element}
 */
export const LastWeek = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<LastWeekPage />
		</Suspense>
	);
};
