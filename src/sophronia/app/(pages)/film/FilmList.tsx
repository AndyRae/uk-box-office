import { FilmTable } from 'components/tables/FilmTable';
import { FilmListData } from 'interfaces/Film';

export const FilmList = ({ films }: { films: FilmListData }): JSX.Element => {
	return <div>{films && <FilmTable films={films} />}</div>;
};
