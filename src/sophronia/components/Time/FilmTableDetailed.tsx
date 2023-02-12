import Link from 'next/link';
import { BaseTable, Td, Tr } from '../charts/BaseTable';
import { MetricChange } from '../charts/MetricChange';
import { BoxOfficeWeek, TableData } from 'interfaces/BoxOffice';

/**
 * @description Film Table component for the time view.
 * Each film is compared to the previous week.
 * @param {object} props - The props
 * @param {Array} props.data - Array of films
 * @param {Array} props.comparisonData - Array of films from the previous week
 * @returns {JSX.Element}
 */
export const FilmTableDetailed = ({
	data,
	comparisonData,
}: {
	data: TableData;
	comparisonData?: BoxOfficeWeek[];
}): JSX.Element => {
	const columns = [
		{ label: 'rank', isNumeric: true },
		{ label: 'title' },
		{ label: 'distributor' },
		{ label: 'weekend box office', isNumeric: true },
		{ label: 'week box office', isNumeric: true },
		{ label: 'change weekend', isNumeric: true },
		{ label: 'weeks', isNumeric: true },
		{ label: 'cinemas', isNumeric: true },
		{ label: 'site average', isNumeric: true },
	];

	// Only show comparison on a week view.
	if (!comparisonData) {
		columns.splice(5, 1);
	}

	return (
		<BaseTable columns={columns}>
			{data.map((film, index) => {
				let change: number | undefined;
				if (comparisonData && comparisonData?.length > 0) {
					const previousFilm = comparisonData!.find(
						(object) => object.film === film.title
					);
					if (previousFilm) {
						change = Math.ceil(
							((film.weekendGross - previousFilm.weekend_gross) /
								previousFilm.weekend_gross) *
								100
						);
					}
				}

				return (
					<Tr key={film.filmSlug} index={index}>
						<Td isNumeric>{index + 1}</Td>
						<Td isHighlight>
							<Link href={`/film/${film.filmSlug}`}>{film.title}</Link>
						</Td>
						<Td>{film.distributor}</Td>
						<Td isNumeric>£ {film.weekendGross.toLocaleString('en-GB')}</Td>
						<Td isNumeric>£ {film.weekGross.toLocaleString('en-GB')}</Td>
						{comparisonData && (
							<Td isNumeric>{change && <MetricChange value={change} />}</Td>
						)}
						<Td isNumeric>{film.weeks}</Td>
						<Td isNumeric>{film.numberOfCinemas}</Td>
						<Td isNumeric>
							£ {Math.ceil(film.siteAverage).toLocaleString('en-GB')}
						</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
