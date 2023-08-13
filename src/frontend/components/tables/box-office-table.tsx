import Link from 'next/link';
import { Date } from '@/components/date';
import { BaseTable, Td, Tr } from '@/components/tables/base-table';
import { MetricChange } from '@/components/metric-change';
import { FilmWithWeeks } from 'interfaces/Film';

/**
 * @description Box Office Table component
 * @param {Array} data - Array of box office data
 * @returns {JSX.Element}
 * @example
 * <BoxOfficeTable data={data} />
 */
export const BoxOfficeTable = ({
	data,
}: {
	data: FilmWithWeeks;
}): JSX.Element => {
	const columns = [
		{ label: 'week' },
		{ label: 'date' },
		{ label: 'rank', isNumeric: true },
		{ label: 'cinemas', isNumeric: true },
		{ label: 'weekend box office (£)', isNumeric: true },
		{ label: 'week box office (£)', isNumeric: true },
		{ label: 'change weekend', isNumeric: true },
		{ label: 'site average (£)', isNumeric: true },
		{ label: 'total box office (£)', isNumeric: true },
	];
	return (
		<BaseTable columns={columns}>
			{data.weeks.map((week, index: number) => {
				const previousWeek = data.weeks[index - 1];
				const changeWeekend = previousWeek
					? Math.ceil(
							((week.weekend_gross - previousWeek.weekend_gross) /
								previousWeek.weekend_gross) *
								100
					  )
					: 0;

				const [year, month, day] = week.date.split('-');

				return (
					<Tr key={week.id} index={index}>
						<Td>{week.weeks_on_release}</Td>
						<Td isHighlight>
							<Link href={`/time/${year}/m/${parseInt(month, 10)}/d/${day}`}>
								<Date dateString={week.date} />
							</Link>
						</Td>
						<Td isNumeric>{week.rank}</Td>
						<Td isNumeric>{week.number_of_cinemas}</Td>
						<Td isNumeric>{week.weekend_gross.toLocaleString('en-GB')}</Td>
						<Td isNumeric>{week.week_gross.toLocaleString('en-GB')}</Td>
						<Td isNumeric>
							<MetricChange value={changeWeekend} />
						</Td>
						<Td isNumeric>
							{Math.ceil(week.site_average).toLocaleString('en-GB')}
						</Td>
						<Td isNumeric>{week.total_gross.toLocaleString('en-GB')}</Td>
					</Tr>
				);
			})}
		</BaseTable>
	);
};
