import Link from 'next/link';
import { BaseTable, Td, Tr } from 'components/charts/BaseTable';
import { TopFilm } from 'interfaces/TopFilm';

/**
 * @description Top Films Table component
 * @param {Array} data - Array of box office data for top films
 * @returns {JSX.Element}
 */
export const TopFilmsTable = ({ data }: { data: TopFilm[] }): JSX.Element => {
	const columns = [
		{ label: 'rank', isNumeric: true },
		{ label: 'title' },
		{ label: 'distributor' },
		{ label: 'box office', isNumeric: true },
	];

	return (
		<BaseTable columns={columns}>
			{data.map((obj, index: number) => {
				return (
					<Tr key={index} index={index}>
						<Td isNumeric>{index + 1}</Td>
						<Td isHighlight>
							<Link href={`/film/${obj.film.slug}`}>{obj.film.name}</Link>
						</Td>
						<Td>{obj.film.distributor.name}</Td>
						<Td isNumeric>£ {obj.gross.toLocaleString('en-GB')}</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
