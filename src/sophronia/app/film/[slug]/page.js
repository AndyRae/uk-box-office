import Link from 'next/link';
import { BoxOfficeTable } from './BoxOfficeTable';
import { PageTitle } from 'components/ui/PageTitle';
import { Card } from 'components/ui/Card';
import { Date } from 'components/Date';
import { StructuredTimeData } from 'components/StructuredData';
import { DatasourceButton } from 'components/Dashboard/Datasource';
import { ExportCSV } from 'components/ui/ExportCSV';
import { TimeLineChart } from 'components/Time/TimeLineChart';

import { getFilm } from './getFilm';

export default async function Page({ params }) {
	const data = await getFilm(params.slug);

	// Unwrap first week date logic
	const weekOne = data.weeks[0];
	const weeksOnRelease = weekOne.weeks_on_release;
	const isFirstWeek = weeksOnRelease === 1 ? true : false;
	const releaseDate = weekOne.date;

	const multiple = (data.gross / weekOne.weekend_gross).toFixed(2);

	// Rename data to make it easy to reuse charts
	const cumulativeData = data.weeks.map(
		({ total_gross: week_gross, date }) => ({
			date,
			week_gross,
		})
	);

	return (
		<div>
			<StructuredTimeData
				title={`${data.name}`}
				endpoint={`/film/${params.slug}`}
				time={releaseDate}
			/>

			<PageTitle>
				{data.name} {isFirstWeek && `(${releaseDate.split('-')[0]})`}
			</PageTitle>

			<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5'>
				<Card
					title='Total Box Office'
					subtitle={`£ ${data.gross.toLocaleString('en-GB')}`}
				/>

				{isFirstWeek && (
					<Card
						title='Release Date'
						subtitle={<Date dateString={releaseDate} />}
					/>
				)}

				<Card title='Multiple' subtitle={`x${multiple}`} />

				<Card title={data.countries.length > 1 ? 'Countries' : 'Country'}>
					<ul className='flex flex-wrap justify-center'>
						{data.countries.map((country) => {
							return (
								<li key={country.id} className='mr-2'>
									<Link
										key={country.name}
										href={`/country/${country.slug}`}
										className='text'
									>
										{country.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</Card>

				<Card title='Distributor'>
					<Link href={`/distributor/${data.distributor.slug}`}>
						<h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
							{data.distributor.name}
						</h5>
					</Link>
				</Card>
			</div>

			<div className='grid md:grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5 mt-3 md:mt-6'>
				{data.weeks.length >= 2 && (
					<Card title='Weekly Box Office'>
						<TimeLineChart data={data.weeks} />
					</Card>
				)}
				{data.weeks.length >= 2 && (
					<Card title='Cumulative Box Office'>
						<TimeLineChart
							data={cumulativeData}
							color='#1E3A8A'
							allowRollUp={false}
						/>
					</Card>
				)}
			</div>

			<div className='flex flex-row-reverse my-6'>
				<DatasourceButton />
				<ExportCSV data={data.weeks} filename={`${data.name}_data.csv`} />
			</div>

			<BoxOfficeTable data={data} />
		</div>
	);
}
