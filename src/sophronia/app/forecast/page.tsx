import { getBackendURL } from 'lib/ApiFetcher';

import { ForecastChart } from 'components/charts/ForecastChart';
import { PageTitle } from 'components/ui/PageTitle';
import { PageContent } from 'components/ui/PageContent';
import { Card } from 'components/ui/Card';
import { Topline } from 'interfaces/BoxOffice';

type ForecastData = {
	results: Topline[];
};

/**
 * Get the forecast data from the backend
 * @param {string} startDate
 * @param {string} endDate
 * @param {number} limit
 * @returns {Promise<ForecastData>}
 * @example
 * const data = await getForecast();
 */
async function getForecast(
	startDate: string,
	endDate: string,
	limit: number = 10
): Promise<ForecastData> {
	const url = getBackendURL();
	const res = await fetch(
		`${url}boxoffice/topline?start=${startDate}&end=${endDate}&limit=${limit}`
	);
	return res.json();
}

export default async function Page(): Promise<JSX.Element> {
	Date.prototype.addDays = function (days) {
		var date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	};

	// Get the last 6 months in API format
	const today = new Date();
	const start = today.addDays(-182);
	const end = today.addDays(182);
	const startDate = `${start.getFullYear()}-${
		start.getMonth() + 1
	}-${start.getDate()}`;
	const endDate = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`;

	const data = await getForecast(startDate, endDate);
	return (
		<>
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
		</>
	);
}