import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';

export const FilmTable = ({ films }) => {
	const columns = [
		{ label: 'title' },
		{ label: 'distributor' },
		{ label: 'box office', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{films.results.map((film, index) => (
				<Tr key={film.id} index={index}>
					<Td isHighlight>
						<Link to={`/film/${film.slug}`}>{film.name}</Link>
					</Td>
					<Td>{film.distributor.name}</Td>
					<Td isNumeric>£ {film.gross.toLocaleString('en-GB')}</Td>
				</Tr>
			))}
		</BaseTable>
	);
};
