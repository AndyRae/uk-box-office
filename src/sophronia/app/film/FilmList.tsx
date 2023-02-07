import { FilmTable } from 'components/Film/FilmTable';

export const FilmList = ({
	films,
	pageIndex,
}: {
	films: [];
	pageIndex: number;
}): JSX.Element => {
	return <div>{films && <FilmTable films={films} />}</div>;
};
