import { useFilm } from '../../api/films';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BoxOfficeTable } from '../../components/Film/BoxOfficeTable';

export const Film = () => {
	const { slug } = useParams();
	const { data, error } = useFilm(slug);

	return (
		<div>
			<h1 className='text-3xl font-bold py-5 capitalize'>{data.name}</h1>
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
