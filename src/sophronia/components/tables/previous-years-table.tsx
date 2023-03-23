import Link from 'next/link';
import { BaseTable, Td, Tr } from 'components/tables/base-table';
import { MetricChange } from 'components/metric-change';
import { BoxOfficeSummary } from 'interfaces/BoxOffice';

/**
 * @description Previous Table component for time.
 * @param {Array} data - Array of box office data for years.
 * @returns {JSX.Element}
 */
export const PreviousTable = ({
	data,
}: {
	data: BoxOfficeSummary[];
}): JSX.Element => {
	const columns = [
		{ label: 'year', isNumeric: true },
		{ label: 'total box office', isNumeric: true },
		{ label: 'change YOY', isNumeric: true },
		{ label: 'site average', isNumeric: true },
		{ label: 'weekend box office', isNumeric: true },
		{ label: 'cinemas', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{data.map((year, index) => {
				const previousYear = data[index + 1];
				const changeYOY = previousYear
					? Math.ceil(
							((year.week_gross - previousYear.week_gross) /
								previousYear.week_gross) *
								100
					  )
					: 0;

				const siteAverage = year.weekend_gross / year.number_of_cinemas;

				return (
					<Tr key={index} index={index}>
						<Td isNumeric isHighlight>
							<Link href={`/time/${year.year}`}>{year.year}</Link>
						</Td>
						<Td isNumeric>£ {year.week_gross.toLocaleString('en-GB')}</Td>
						<Td isNumeric>
							<MetricChange value={changeYOY} />
						</Td>
						<Td isNumeric>
							£ {Math.ceil(siteAverage).toLocaleString('en-GB')}
						</Td>
						<Td isNumeric>£ {year.weekend_gross.toLocaleString('en-GB')}</Td>
						<Td isNumeric>{year.number_of_cinemas}</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
