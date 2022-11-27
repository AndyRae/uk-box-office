import { BaseTable, Tr, Td } from '../charts/BaseTable';
import { Link } from 'react-router-dom';

export const FilmsTable = ({ data }) => {
	const columns = [
		{ label: 'title' },
		{ label: 'distributor' },
		{ label: 'country' },
		{ label: 'box office', isNumeric: true },
	];

	return (
		<BaseTable columns={columns}>
			{data.map((film, index) => (
				<Tr key={film.id} index={index}>
					<Td isHighlight>
						<Link to={`/film/${film.slug}`}>{film.name}</Link>
					</Td>
					<Td>{film.distributor.name}</Td>
					<Td>{film.country.map((c, index) => `${c.name} `)}</Td>
					<Td isNumeric>£ {film.gross.toLocaleString('en-GB')}</Td>
				</Tr>
			))}
		</BaseTable>
	);
};
