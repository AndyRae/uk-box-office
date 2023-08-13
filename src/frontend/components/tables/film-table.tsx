import { Film } from 'interfaces/Film';
import Link from 'next/link';
import { BaseTable, Td, Tr } from './base-table';
import { toTitleCase } from 'lib/helpers/toTitleCase';

/**
 * @description Film Table component
 * @param {object} props - The props
 * @param {Array} props.films - Array of films
 * @returns {JSX.Element}
 * @example
 * <FilmTable films={films} />
 */
export const FilmTable = ({
	films,
}: {
	films: { results: Film[] };
}): JSX.Element => {
	const columns = [
		{ label: 'title' },
		{ label: 'distributor' },
		{ label: 'box office (£)', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{films.results.map((film, index) => (
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
					<Td isNumeric>{film.gross.toLocaleString('en-GB')}</Td>
				</Tr>
			))}
		</BaseTable>
	);
};
