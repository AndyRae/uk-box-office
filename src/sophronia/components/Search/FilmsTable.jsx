import { BaseTable, Tr, Td } from '../charts/BaseTable';
import Link from 'next/link';

/**
 * @description Films Table component for search
 * @param {Array} data - Array of films
 * @returns {JSX.Element}
 * @example
 * <FilmsTable data={data} />
 */
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
						<Link href={`/film/${film.slug}`}>{film.name}</Link>
					</Td>
					<Td>{film.distributor.name}</Td>
					<Td>{film.countries.map((c, index) => `${c.name} `)}</Td>
					<Td isNumeric>£ {film.gross.toLocaleString('en-GB')}</Td>
				</Tr>
			))}
		</BaseTable>
	);
};
