'use client';

import { BaseTable, Td, Tr } from 'components/charts/BaseTable';
import { FilmWithWeeks } from 'interfaces/Film';
import Link from 'next/link';
import { calculateNumberOfCinemas } from 'lib/utils/groupData';
import { Date } from 'components/Date';

type TableProps = {
	data: FilmWithWeeks[];
};

export const CompareTable = ({ data }: TableProps): JSX.Element => {
	const columns = [
		{ label: '' },
		{ label: 'title' },
		{ label: 'release' },
		{ label: 'distributor' },
		{ label: 'total box office', isNumeric: true },
		{ label: 'weeks', isNumeric: true },
		{ label: 'multiple', isNumeric: true },
		{ label: 'cinemas', isNumeric: true },
		{ label: 'site average', isNumeric: true },
	];

	return (
		<BaseTable columns={columns}>
			{data?.map((film, index: number) => {
				// Unwrap first week date logic
				const weekOne = film.weeks[0];
				const releaseDate = weekOne.date;

				const multiple = (film.gross / weekOne.weekend_gross).toFixed(2);
				const cinemas = calculateNumberOfCinemas(film.weeks);
				const siteAverage = film.gross / cinemas;

				// Process colors
				const divStyle = {
					backgroundColor: film.color,
				};

				return (
					<Tr key={film.slug} index={index}>
						<Td>
							<span
								className={`flex w-5 h-5 b rounded-full`}
								style={divStyle}
							></span>
						</Td>
						<Td isHighlight>
							<Link href={`/film/${film.slug}`}>{film.name}</Link>
						</Td>
						<Td>
							<Date dateString={releaseDate} />
						</Td>
						<Td>{film.distributor.name}</Td>
						<Td isNumeric>£ {film.gross.toLocaleString()}</Td>
						<Td isNumeric>{film.weeks.length}</Td>
						<Td isNumeric>x{multiple}</Td>
						<Td isNumeric>{cinemas}</Td>
						<Td isNumeric>£ {siteAverage.toLocaleString()}</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
