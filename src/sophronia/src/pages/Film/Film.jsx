import { useFilm } from '../../api/films';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BoxOfficeTable } from '../../components/Film/BoxOfficeTable';
import { Card } from '../../components/Dashboard/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Suspense } from 'react';

export const FilmPage = () => {
	const { slug } = useParams();
	const { data, error } = useFilm(slug);

	return (
		<div>
			<h1 className='text-4xl font-bold py-5 capitalize'>{data.name}</h1>
			<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4  '>
				<Card title='Box Office' subtitle={data.gross} />
				<Card title='Multiple' />
				<Card title='Countries' />
				<Card title='Distributor' />
			</div>
			<h1 className='text-1xl capitalize'>{data.distributor}</h1>
			<h1 className='text-1xl'>{data.gross}</h1>

			{data.country.map((country) => {
				return (
					<Link key={country.name} to={country.slug} className='text'>
						{country.name}
					</Link>
				);
			})}

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
