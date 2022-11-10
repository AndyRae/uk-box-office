import { Suspense } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { useBoxOfficeTopline } from '../api/boxoffice';
import { ForecastChart } from '../components/charts/ForecastChart';
import { PageTitle } from '../components/ui/PageTitle';

const ForecastPage = () => {
	Date.prototype.addDays = function (days) {
		var date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	};

	const today = new Date();
	const start = today.addDays(-182);
	const end = today.addDays(182);
	const startDate = `${start.getFullYear()}-${
		start.getMonth() + 1
	}-${start.getDate()}`;
	const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;

	const { data, isLoading, isError } = useBoxOfficeTopline(startDate, endDate);

	return (
		<div>
			<PageTitle>Forecast</PageTitle>
			<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'></div>

			{data && <ForecastChart data={data.results} />}
		</div>
	);
};

export const Forecast = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<ForecastPage />
		</Suspense>
	);
};
