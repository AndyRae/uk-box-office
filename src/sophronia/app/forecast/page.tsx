import { getBackendURL } from 'lib/ApiFetcher';

import { ForecastChart } from 'components/charts/ForecastChart';
import { PageTitle } from 'components/ui/PageTitle';
import { PageContent } from 'components/ui/PageContent';
import { Card } from 'components/ui/Card';
import { Topline } from 'interfaces/BoxOffice';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Forecast | Box Office Data',
	description:
		'UK Box Office forecast of the next 12 months of UK cinema box office revenue.',
};

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

/**
 * Sets future week_gross box office data to undefined.
 * Prevents charts and tables from showing 0.
 * @param data : Topline[] box office data
 * @returns data array of box office data.
 */
function updateWeekGross(data: Topline[]) {
	const currentDate = new Date();
	data.forEach((item) => {
		const itemDate = new Date(item.date);
		if (itemDate > currentDate) {
			item.week_gross = undefined;
		}
	});
	return data;
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

	const filteredFutureData = updateWeekGross(data.results);

	return (
		<>
			<PageTitle>Forecast</PageTitle>

			<div className='my-10'>
				{data && <ForecastChart data={filteredFutureData} />}
			</div>

			<div className='max-w-xl'>
				<PageContent>
					<h3 className='text-2xl font-bold mb-3 dark:text-white'>
						How does this work?
					</h3>
					<p>
						This forecast uses historical data to build a simple linear
						regression model with seasonal affects.
					</p>
					<p>
						This model is then used to predict the next six months of box office
						data.
					</p>
				</PageContent>
			</div>
		</>
	);
}
