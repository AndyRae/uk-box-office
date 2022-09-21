import { Pagination } from '../ui/Pagination';
import { Link } from 'react-router-dom';
import { FilmTable } from './FilmTable';

export const FilmList = ({ films, pageIndex }) => {
	return (
		<div>
			<h1 className='text-3xl font-bold py-5'>Films</h1>

			{films && <FilmTable films={films} />}
		</div>
	);
};
