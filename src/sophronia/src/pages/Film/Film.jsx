import { useFilm } from '../../api/films';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BoxOfficeTable } from '../../components/Film/BoxOfficeTable';
import { Card } from '../../components/Dashboard/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense, useEffect } from 'react';
import { Date } from '../../components/Date';
import { ExportCSV } from '../../components/ui/ExportCSV';
import { StructuredTimeData } from '../../components/StructuredData';
import { PageTitle } from '../../components/ui/PageTitle';
import { TimeLineChart } from '../../components/Time/TimeLineChart';

export const FilmPage = () => {
	const { slug } = useParams();
	const { data, error } = useFilm(slug);

	const weekOne = data.weeks[0];
	const weeksOnRelease = weekOne.weeks_on_release;
	const isFirstWeek = weeksOnRelease === 1 ? true : false;
	const releaseDate = weekOne.date;

	const multiple = (data.gross / weekOne.weekend_gross).toFixed(2);

	useEffect(() => {
		document.title = `${data?.name} - UK Box Office Data`;
	}, []);

	// Rename to make it easy to reuse charts
	const chartData = data.weeks.map(({ week_gross: weekGross, date }) => ({
		date,
		weekGross,
	}));
	const cumulativeData = data.weeks.map(({ total_gross: weekGross, date }) => ({
		date,
		weekGross,
	}));

	return (
		<div>
			<StructuredTimeData
				title={`${data.name}`}
				endpoint={`/film/${slug}`}
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

				<Card title={data.country.length > 1 ? 'Countries' : 'Country'}>
					<ul className='flex flex-wrap justify-center'>
						{data.country.map((country) => {
							return (
								<li key={country.id} className='mr-2'>
									<Link
										key={country.name}
										to={`/country/${country.slug}`}
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
					<Link to={`/distributor/${data.distributor.slug}`}>
						<h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
							{data.distributor.name}
						</h5>
					</Link>
				</Card>
			</div>

			<div className='grid md:grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5 mt-3 md:mt-6'>
				{data.weeks.length >= 2 && (
					<Card title='Weekly Box Office'>
						<TimeLineChart data={chartData} />
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
				<ExportCSV data={data.weeks} filename={`${data.name}_data.csv`} />
			</div>

			<BoxOfficeTable data={data} />
		</div>
	);
};

export const Film = () => {
	return (
		<Suspense fallback={<Spinner />}>
			<FilmPage />
		</Suspense>
	);
};
