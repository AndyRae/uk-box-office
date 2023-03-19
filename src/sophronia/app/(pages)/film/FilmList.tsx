import { FilmTable } from 'components/tables/film-table';
import { FilmListData } from 'interfaces/Film';

export const FilmList = ({ films }: { films: FilmListData }): JSX.Element => {
	return <div>{films && <FilmTable films={films} />}</div>;
};
