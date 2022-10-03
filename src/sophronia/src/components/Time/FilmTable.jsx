import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';

export const FilmTable = ({ data }) => {
	const columns = [
		{ label: 'rank', isNumeric: true },
		{ label: 'title' },
		{ label: 'distributor' },
		{ label: 'weekend box office', isNumeric: true },
		{ label: 'week box office', isNumeric: true },
		{ label: 'weeks', isNumeric: true },
		{ label: 'cinemas', isNumeric: true },
		{ label: 'site average', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{data.map((film, index) => (
				<Tr key={film.filmSlug} index={index}>
					<Td isNumeric>{index + 1}</Td>
					<Td>
						<Link to={`/film/${film.filmSlug}`}>{film.title}</Link>
					</Td>
					<Td>{film.distributor}</Td>
					<Td isNumeric>£ {film.weekendGross.toLocaleString('en-GB')}</Td>
					<Td isNumeric>£ {film.weekGross.toLocaleString('en-GB')}</Td>
					<Td isNumeric>{film.weeks}</Td>
					<Td isNumeric>{film.numberOfCinemas}</Td>
					<Td isNumeric>
						£ {Math.ceil(film.siteAverage).toLocaleString('en-GB')}
					</Td>
				</Tr>
			))}
		</BaseTable>
	);
};
