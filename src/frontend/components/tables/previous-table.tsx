import Link from 'next/link';
import { BaseTable, Td, Tr } from '@/components/tables/base-table';
import { MetricChange } from '@/components/metric-change';
import { BoxOfficeYear } from '@/interfaces/BoxOffice';

/**
 * @description Previous Table component for distributors.
 * @param {Array} data - Array of box office data for years.
 * @returns {JSX.Element}
 */
export const PreviousTable = ({
	data,
}: {
	data: BoxOfficeYear[];
}): JSX.Element => {
	const columns = [
		{ label: 'year' },
		{ label: 'films', isNumeric: true },
		{ label: 'total box office (£)', isNumeric: true },
		{ label: 'change YOY', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{data.map((year, index) => {
				const previousYear = data[index + 1];
				const changeYOY = previousYear
					? Math.ceil(
							((year.total - previousYear.total) / previousYear.total) * 100
					  )
					: 0;

				return (
					<Tr key={index} index={index}>
						<Td isHighlight>
							<Link href={`/time/${year.year}`}>{year.year}</Link>
						</Td>
						<Td isNumeric>{year.count}</Td>
						<Td isNumeric>£ {year.total.toLocaleString('en-GB')}</Td>
						<Td isNumeric>
							<MetricChange value={changeYOY} />
						</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
