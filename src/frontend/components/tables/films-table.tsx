import Link from 'next/link';
import { BaseTable, Tr, Td } from '@/components/tables/base-table';
import { Film } from '@/interfaces/Film';
import { toTitleCase } from '@/lib/helpers/toTitleCase';

/**
 * @description Films Table component for search
 * @param {Array} data - Array of films
 * @returns {JSX.Element}
 * @example
 * <FilmsTable data={data} />
 */
export const FilmsTable = ({ data }: { data: Film[] }): JSX.Element => {
	const columns = [
		{ label: 'title' },
		{ label: 'distributor' },
		{ label: 'country' },
		{ label: 'box office (£)', isNumeric: true },
	];

	return (
		<BaseTable columns={columns}>
			{data.map((film, index: number) => (
				<Tr key={film.id} index={index}>
					<Td isHighlight>
						<Link href={`/film/${film.slug}`}>{toTitleCase(film.name)}</Link>
					</Td>
					<Td>
						{film.distributors &&
							film.distributors.map((distributor) =>
								toTitleCase(distributor.name)
							)}
					</Td>
					<Td>{film.countries.map((c, index: number) => `${c.name} `)}</Td>
					<Td isNumeric>{film.gross.toLocaleString('en-GB')}</Td>
				</Tr>
			))}
		</BaseTable>
	);
};
