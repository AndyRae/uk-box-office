import { useFilm } from '../../api/films';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BoxOfficeTable } from '../../components/Film/BoxOfficeTable';
import { Card } from '../../components/Dashboard/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense } from 'react';
import { Date } from '../../components/Date';

export const FilmPage = () => {
	const { slug } = useParams();
	const { data, error } = useFilm(slug);

	const weekOne = data.weeks[0];
	const weeksOnRelease = weekOne.weeks_on_release;
	const isFirstWeek = weeksOnRelease === 1 ? true : false;
	const releaseDate = weekOne.date;

	const multiple = (data.gross / weekOne.weekend_gross).toFixed(2);

	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>
				{data.name} {isFirstWeek && '(2020)'}
			</h1>
			<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
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

				<Card
					title='Distributor'
					subtitle={data.distributor.name}
					link={`/distributor/${data.distributor.slug}`}
				/>
			</div>

			{data.weeks.length >= 2 && <div className='chart' />}

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
