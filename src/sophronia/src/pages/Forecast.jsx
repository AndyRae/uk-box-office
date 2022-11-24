import { Suspense } from 'react';
import { Spinner } from '../components/ui/Spinner';
import { useBoxOfficeTopline } from '../api/boxoffice';
import { ForecastChart } from '../components/charts/ForecastChart';
import { PageTitle } from '../components/ui/PageTitle';
import { PageContent } from '../components/ui/PageContent';
import { Card } from '../components/Dashboard/Card';

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

			<div className='my-10'>
				{data && (
					<Card>
						<ForecastChart data={data.results} />
					</Card>
				)}
			</div>

			<div className='max-w-xl'>
				<Card>
					<PageContent>
						<h3 className='text-2xl font-bold mb-3 dark:text-white'>
							How does this work?
						</h3>
						<p>
							This forecast uses historical data to build a simple linear
							regression model with seasonal affects.
						</p>
						<p>
							This model is then used to predict the next six months of box
							office data.
						</p>
					</PageContent>
				</Card>
			</div>
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
