import { Link } from 'react-router-dom';
import { BaseTable, Td, Tr } from '../charts/BaseTable';
import { MetricChange } from '../charts/MetricChange';

export const TopFilmsTable = ({ data }) => {
	const columns = [
		{ label: 'rank', isNumeric: true },
		{ label: 'title' },
		{ label: 'distributor' },
		{ label: 'box office', isNumeric: true },
	];

	return (
		<BaseTable columns={columns}>
			{data.map((obj, index) => {
				return (
					<Tr key={index} index={index}>
						<Td isNumeric>{index + 1}</Td>
						<Td isHighlight>
							<Link to={`/film/${obj.film.slug}`}>{obj.film.name}</Link>
						</Td>
						<Td>{obj.film.distributor.name}</Td>
						<Td isNumeric>£ {obj.gross.toLocaleString('en-GB')}</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
