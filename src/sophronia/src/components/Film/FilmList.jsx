import { FilmTable } from './FilmTable';

export const FilmList = ({ films, pageIndex }) => {
	return <div>{films && <FilmTable films={films} />}</div>;
};
